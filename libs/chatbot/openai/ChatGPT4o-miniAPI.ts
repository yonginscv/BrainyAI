import {OpenaiBot} from "~libs/chatbot/openai/index";
import {OpenAIAuth} from "~libs/open-ai/open-ai-auth";
import {BotSession} from "~libs/chatbot/BotSessionBase";
import type {BotCompletionParams, BotConstructorParams} from "~libs/chatbot/IBot";
import {ConversationResponse, ResponseMessageType} from "~libs/open-ai/open-ai-interface";
import {ChatError, ErrorCode} from "~utils/errors";
import {Logger} from "~utils/logger";
import {BotSupportedMimeType} from "~libs/chatbot/BotBase";
import { Storage } from "@plasmohq/storage";

// Auth Singleton
class ChatGPTAPIAuthSingleton {
    private static instance: ChatGPTAPIAuthSingleton;
    auth: OpenAIAuth;

    protected constructor() {
        // ignore
    }

    static getInstance(): ChatGPTAPIAuthSingleton {
        if (!ChatGPTAPIAuthSingleton.instance) {
            ChatGPTAPIAuthSingleton.instance = new ChatGPTAPIAuthSingleton();
            ChatGPTAPIAuthSingleton.instance.auth = new OpenAIAuth();
        }
        return ChatGPTAPIAuthSingleton.instance;
    }
}

// Session Singleton
class ChatGPTAPISessionSingleton {
    private static instance: ChatGPTAPISessionSingleton | null;
    static globalConversationId: string;
    session: BotSession;

    private constructor() {
        this.session = new BotSession(ChatGPTAPISessionSingleton.globalConversationId);
    }

    static destroy() {
        ChatGPTAPISessionSingleton.globalConversationId = "";
        ChatGPTAPISessionSingleton.instance = null;
    }

    static getInstance(globalConversationId: string) {
        if (globalConversationId !== ChatGPTAPISessionSingleton.globalConversationId) {
            ChatGPTAPISessionSingleton.destroy();
        }

        ChatGPTAPISessionSingleton.globalConversationId = globalConversationId;

        if (!ChatGPTAPISessionSingleton.instance) {
            ChatGPTAPISessionSingleton.instance = new ChatGPTAPISessionSingleton();
        }

        return ChatGPTAPISessionSingleton.instance;
    }
}

const modelSlug = "gpt-4o-mini";

export default class ChatGPT4oMiniAPI extends OpenaiBot {
    static botName = 'gpt-4o-mini';
    model = modelSlug;
    static requireLogin = false;
    static desc = 'OpenAI API를 통한 gpt-4o-mini 접근';
    static maxTokenLimit = 9000;
    supportedUploadTypes = [BotSupportedMimeType.TXT];

    constructor(params: BotConstructorParams) {
        super(params);
        this.botSession = ChatGPTAPISessionSingleton.getInstance(params.globalConversationId);
        this.authInstance = ChatGPTAPIAuthSingleton.getInstance();
    }

    async completion({prompt, rid, cb}: BotCompletionParams): Promise<void> {
        try {
            // API 키 가져오기
            const storage = new Storage();
            const apiKey = await storage.get('openai-api-key');
            
            if (!apiKey) {
                throw new Error('API 키가 설정되지 않았습니다.');
            }

            console.log('completion api called with prompt:', prompt);
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`  // 저장된 API 키 사용
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [{
                        role: 'user',
                        content: prompt
                    }],
                    stream: true
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const {value, done} = await reader?.read() || {};
                if (done) break;

                buffer += decoder.decode(value, {stream: true});
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') continue;

                        try {
                            const json = JSON.parse(data);
                            const content = json.choices[0]?.delta?.content || '';

                            cb(rid, new ConversationResponse({
                                conversation_id: this.botSession.session.botConversationId,
                                message_type: ResponseMessageType.GENERATING,
                                message_text: content,
                                message_id: json.id
                            }));
                        } catch (e) {
                            Logger.error('Failed to parse JSON:', e);
                        }
                    }
                }
            }

            cb(rid, new ConversationResponse({
                conversation_id: this.botSession.session.botConversationId,
                message_type: ResponseMessageType.DONE
            }));

        } catch (error) {
            Logger.error('API Error:', error);
            cb(rid, new ConversationResponse({
                conversation_id: this.botSession.session.botConversationId,
                message_type: ResponseMessageType.ERROR,
                error: new ChatError(ErrorCode.MODEL_INTERNAL_ERROR)
            }));
        }
    }

    getBotName(): string {
        return ChatGPT4oMiniAPI.botName;
    }

    getRequireLogin(): boolean {
        return ChatGPT4oMiniAPI.requireLogin;
    }

    getMaxTokenLimit(): number {
        return ChatGPT4oMiniAPI.maxTokenLimit;
    }

    uploadFile(file: File): Promise<string> {
        return this.fileInstance.uploadFile(file, this.supportedUploadTypes);
    }
} 