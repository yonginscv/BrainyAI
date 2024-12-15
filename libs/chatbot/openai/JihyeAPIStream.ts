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
class JihyeAPIStreamAuthSingleton {
    private static instance: JihyeAPIStreamAuthSingleton;
    auth: OpenAIAuth;

    protected constructor() {
        // ignore
    }

    static getInstance(): JihyeAPIStreamAuthSingleton {
        if (!JihyeAPIStreamAuthSingleton.instance) {
            JihyeAPIStreamAuthSingleton.instance = new JihyeAPIStreamAuthSingleton();
            JihyeAPIStreamAuthSingleton.instance.auth = new OpenAIAuth();
        }
        return JihyeAPIStreamAuthSingleton.instance;
    }
}

// Session Singleton
class JihyeAPIStreamSessionSingleton {
    private static instance: JihyeAPIStreamSessionSingleton | null;
    static globalConversationId: string;
    session: BotSession;

    private constructor() {
        this.session = new BotSession(JihyeAPIStreamSessionSingleton.globalConversationId);
    }

    static destroy() {
        JihyeAPIStreamSessionSingleton.globalConversationId = "";
        JihyeAPIStreamSessionSingleton.instance = null;
    }

    static getInstance(globalConversationId: string) {
        if (globalConversationId !== JihyeAPIStreamSessionSingleton.globalConversationId) {
            JihyeAPIStreamSessionSingleton.destroy();
        }

        JihyeAPIStreamSessionSingleton.globalConversationId = globalConversationId;

        if (!JihyeAPIStreamSessionSingleton.instance) {
            JihyeAPIStreamSessionSingleton.instance = new JihyeAPIStreamSessionSingleton();
        }

        return JihyeAPIStreamSessionSingleton.instance;
    }
}

const modelSlug = "anthropic.claude-3-5-sonnet-20240620-v1:0";

export default class JihyeAPIStream extends OpenaiBot {
    static botName = 'jihye-claude-sonnet3.5-stream';
    model = modelSlug;
    static requireLogin = false;
    static desc = 'Jihye claude-sonnet3.5 Stream';
    static maxTokenLimit = 2500;
    supportedUploadTypes = [BotSupportedMimeType.TXT];

    constructor(params: BotConstructorParams) {
        super(params);
        try {
            this.botSession = JihyeAPIStreamSessionSingleton.getInstance(params.globalConversationId);
            this.authInstance = JihyeAPIStreamAuthSingleton.getInstance();
        } catch (e) {
            JihyeAPIStreamSessionSingleton.destroy();
            this.botSession = JihyeAPIStreamSessionSingleton.getInstance(params.globalConversationId);
            this.authInstance = JihyeAPIStreamAuthSingleton.getInstance();
        }
    }

    async completion({prompt, rid, cb, fileRef, file}: BotCompletionParams): Promise<void> {
        try {
            const storage = new Storage();
            const apiKey = await storage.get('jihey-api-key');
            
            if (!apiKey) {
                throw new ChatError(ErrorCode.MODEL_INTERNAL_ERROR, 'API 키가 설정되지 않았습니다.');
            }

            const response = await fetch('https://jihye.ucube.lgudax.cool/api/bedrock/anthropic.claude-3-5-sonnet-20240620-v1:0/stream', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                    'Accept': 'application/vnd.amazon.eventstream'
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

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let messageText = '';
            const messageId = createUuid();

            while (true) {
                const {value, done} = await reader?.read() || {};
                if (done) break;
                
                const chunk = decoder.decode(value);
                messageText += chunk;
                
                cb(rid, new ConversationResponse({
                    conversation_id: this.botSession.session.botConversationId,
                    message_type: ResponseMessageType.GENERATING,
                    message_text: messageText,
                    message_id: messageId,
                    parent_message_id: this.botSession.session.getParentMessageId()
                }));

            }

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
        return JihyeAPIStream.botName;
    }

    getRequireLogin(): boolean {
        return JihyeAPIStream.requireLogin;
    }

    getMaxTokenLimit(): number {
        return JihyeAPIStream.maxTokenLimit;
    }

    uploadFile(file: File): Promise<string> {
        return this.fileInstance.uploadFile(file, this.supportedUploadTypes);
    }
} 