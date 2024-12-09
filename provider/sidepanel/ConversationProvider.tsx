import React, {useContext, useEffect, useState} from "react";
import type {IAskAi} from "~libs/open-ai/open-panel";
import {ModelManagementContext, type Ms} from "~provider/ModelManagementProvider";
import {createUuid} from "~utils";
import eventBus from "~libs/EventBus";

interface IConversationContext {
    messages: ConversationMessage[],
    setMessages: React.Dispatch<React.SetStateAction<ConversationMessage[]>>;
    conversationId: string;
    setConversationId: React.Dispatch<React.SetStateAction<string>>;
    isGeneratingMessage: boolean;
    setIsGeneratingMessage: React.Dispatch<React.SetStateAction<boolean>>;
    conversationTitle: string;
    setConversationTitle: React.Dispatch<React.SetStateAction<string>>;
    resetConversation: () => void;
    windowHeight: number;
    setWindowHeight: React.Dispatch<React.SetStateAction<number>>;
    expandMenu: boolean,
    setExpandMenu: React.Dispatch<React.SetStateAction<boolean>>,
}

export class ConversationMessage {
    id: string;
    foree: 'bot' | 'user';
    data: IAskAi;
    botProviders?: Ms;

    constructor(foree: 'bot' | 'user', data: IAskAi, botProviders?: Ms) {
        // random id with timestamp
        this.id = `${Date.now()}-${Math.random()}`;
        this.foree = foree;
        this.data = data;
        this.botProviders = botProviders;

        return this;
    }
}

export const ConversationContext = React.createContext<IConversationContext>({} as IConversationContext);

export const ConversationProvider = ({children}: { children: React.ReactNode }) => {
    const [messages, setMessages] = useState<IConversationContext['messages']>([]);
    const [globalConversationId, setGlobalConversationId] = useState<IConversationContext['conversationId']>(createUuid());
    const [isGeneratingMessage, setIsGeneratingMessage] = useState<IConversationContext['isGeneratingMessage']>(false);
    const [conversationTitle, setConversationTitle] = useState<string>('');
    const [windowHeight, setWindowHeight] = useState<number>(0);
    const [expandMenu, setExpandMenu] = useState<boolean>(false);
    const {currentBots} = useContext(ModelManagementContext);

    const resetConversation = () => {
        setGlobalConversationId(createUuid());
        setIsGeneratingMessage(false);
        setMessages([]);
    };


    useEffect(() => {
        eventBus.on('newChat', resetConversation);

        return () => {
            eventBus.removeListener('newChat', resetConversation);
        };
    },[]);

    return <ConversationContext.Provider value={{
        messages,
        setMessages,
        conversationId: globalConversationId,
        setConversationId: setGlobalConversationId,
        isGeneratingMessage,
        setIsGeneratingMessage,
        conversationTitle,
        setConversationTitle,
        resetConversation,
        windowHeight,
        setWindowHeight,
        expandMenu,
        setExpandMenu
    }}>
        {children}
    </ConversationContext.Provider>;
};
