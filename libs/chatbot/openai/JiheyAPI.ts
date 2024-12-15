import {OpenaiBot} from "~libs/chatbot/openai/index";
import {OpenAIAuth} from "~libs/open-ai/open-ai-auth";
import {BotSession, SimpleBotMessage} from "~libs/chatbot/BotSessionBase";
import type {BotCompletionParams, BotConstructorParams} from "~libs/chatbot/IBot";
import {ConversationResponse, ResponseMessageType} from "~libs/open-ai/open-ai-interface";
import {ChatError, ErrorCode} from "~utils/errors";
import {Logger} from "~utils/logger";
import {BotSupportedMimeType} from "~libs/chatbot/BotBase";
import { Storage } from "@plasmohq/storage";
import { createUuid } from "~utils";

// Auth Singleton
class JiheyAPIAuthSingleton {
    private static instance: JiheyAPIAuthSingleton;
    auth: OpenAIAuth;

    protected constructor() {
        // ignore
    }

    static getInstance(): JiheyAPIAuthSingleton {
        if (!JiheyAPIAuthSingleton.instance) {
            JiheyAPIAuthSingleton.instance = new JiheyAPIAuthSingleton();
            JiheyAPIAuthSingleton.instance.auth = new OpenAIAuth();
        }
        return JiheyAPIAuthSingleton.instance;
    }
}

// Session Singleton
class JiheyAPISessionSingleton {
    private static instance: JiheyAPISessionSingleton | null;
    static globalConversationId: string;
    session: BotSession;

    private constructor() {
        this.session = new BotSession(JiheyAPISessionSingleton.globalConversationId);
    }

    static destroy() {
        JiheyAPISessionSingleton.globalConversationId = "";
        JiheyAPISessionSingleton.instance = null;
    }

    static getInstance(globalConversationId: string) {
        if (globalConversationId !== JiheyAPISessionSingleton.globalConversationId) {
            JiheyAPISessionSingleton.destroy();
        }

        JiheyAPISessionSingleton.globalConversationId = globalConversationId;

        if (!JiheyAPISessionSingleton.instance) {
            JiheyAPISessionSingleton.instance = new JiheyAPISessionSingleton();
        }

        return JiheyAPISessionSingleton.instance;
    }
}

const modelSlug = "anthropic.claude-3-5-sonnet-20240620-v1:0";

export default class JiheyAPI extends OpenaiBot {
    static botName = 'jihey-ai';
    model = modelSlug;
    static requireLogin = false;
    static desc = 'Jihey AI를 통한 Claude 3.5 Sonnet 접근';
    static maxTokenLimit = 2000;
    supportedUploadTypes = [BotSupportedMimeType.TXT];

    constructor(params: BotConstructorParams) {
        super(params);
        try {
            this.botSession = JiheyAPISessionSingleton.getInstance(params.globalConversationId);
            this.authInstance = JiheyAPIAuthSingleton.getInstance();
        } catch (e) {
            // 컨텍스트가 무효화된 경우 세션과 인증 인스턴스를 재생성
            JiheyAPISessionSingleton.destroy();
            this.botSession = JiheyAPISessionSingleton.getInstance(params.globalConversationId);
            this.authInstance = JiheyAPIAuthSingleton.getInstance();
        }
    }

    async completion({prompt, rid, cb, fileRef, file}: BotCompletionParams): Promise<void> {
        try {
            // API 키 가져오기
            const storage = new Storage();
            const apiKey = await storage.get('jihey-api-key');
            
            if (!apiKey) {
                throw new ChatError(ErrorCode.MODEL_INTERNAL_ERROR, 'API 키가 설정되지 않았습니다.');
            }

            console.log('completion api called with prompt:', prompt);
            const response = await fetch('https://jihye.ucube.lgudax.cool/api/bedrock/anthropic.claude-3-5-sonnet-20240620-v1:0', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                    'accept': '*/*'
                },
                body: JSON.stringify({
                    messages: [{
                        role: 'user',
                        content: [{
                            type: 'text',
                            text: `<s>[INST]${prompt}[/INST]`
                        }]
                    }],
                    max_tokens: 2500,
                    temperature: 1,
                    top_k: 250,
                    top_p: 0.999,
                    stop_sequences: ["\\n\\nHuman:"],
                    anthropic_version: 'bedrock-2023-05-31'
                })
            });

            if (!response.ok) {
                Logger.error('Http error: ', response);
                throw new ChatError(ErrorCode.MODEL_INTERNAL_ERROR, `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            Logger.log("Response:", result);

            // 응답 구조 처리 수정
            let messageText = '';
            let messageId = createUuid();

            try {
                // result.content가 JSON 문자열로 되어있으므로 파싱
                const parsedContent = JSON.parse(result.content);
                
                // 파싱된 content 배열에서 텍스트 추출
                if (parsedContent.content && Array.isArray(parsedContent.content)) {
                    messageText = parsedContent.content
                        .filter(item => item.type === 'text')
                        .map(item => item.text)
                        .join('');
                } else {
                    throw new ChatError(ErrorCode.MODEL_INTERNAL_ERROR, '응답 형식이 올바르지 않습니다.');
                }

                if (!messageText) {
                    throw new ChatError(ErrorCode.MODEL_INTERNAL_ERROR, '응답 텍스트를 받지 못했습니다.');
                }

                // 파싱된 응답에서 id 추출
                if (parsedContent.id) {
                    messageId = parsedContent.id;
                }
            } catch (parseError) {
                Logger.error('Response parsing error:', parseError);
                throw new ChatError(ErrorCode.MODEL_INTERNAL_ERROR, '응답 파싱 중 오류가 발생했습니다.');
            }

            // 생성 중인 상태 콜백
            cb(rid, new ConversationResponse({
                conversation_id: this.botSession.session.botConversationId,
                message_type: ResponseMessageType.GENERATING,
                message_text: messageText,
                message_id: messageId,
                parent_message_id: this.botSession.session.getParentMessageId()
            }));

            // 메시지 저장 및 세션 업데이트
            this.botSession.session.addMessage(new SimpleBotMessage(messageText, messageId));

            // 완료 상태 콜백
            cb(rid, new ConversationResponse({
                conversation_id: this.botSession.session.botConversationId,
                message_type: ResponseMessageType.DONE,
                message_text: messageText,
                message_id: messageId,
                parent_message_id: this.botSession.session.getParentMessageId()
            }));

        } catch (error) {
            Logger.error('API Error:', error);
            cb(rid, new ConversationResponse({
                conversation_id: this.botSession.session.botConversationId,
                message_type: ResponseMessageType.ERROR,
                error: error instanceof ChatError ? error : new ChatError(ErrorCode.MODEL_INTERNAL_ERROR, error.message)
            }));
        }
    }

    getBotName(): string {
        return JiheyAPI.botName;
    }

    getRequireLogin(): boolean {
        return JiheyAPI.requireLogin;
    }

    getMaxTokenLimit(): number {
        return JiheyAPI.maxTokenLimit;
    }

    uploadFile(file: File): Promise<string> {
        return this.fileInstance.uploadFile(file, this.supportedUploadTypes);
    }
} 