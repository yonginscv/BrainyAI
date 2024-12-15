import React, {createContext, useEffect, useRef, useState} from "react";
import {getLatestState} from "~utils";
import ChatGPT35Turbo from "~libs/chatbot/openai/ChatGPT35Turbo";
import {Storage} from "@plasmohq/storage";
import  ChatGPT4Turbo from "~libs/chatbot/openai/ChatGPT4Turbo";
import ChatGPT4oMiniAPI from "~libs/chatbot/openai/ChatGPT4o-miniAPI";
import JiheyAPI from "~libs/chatbot/openai/JiheyAPI";
import JihyeAPIStream from "~libs/chatbot/openai/JihyeAPIStream";
import {Logger} from "~utils/logger";
import ChatGPT4O from "~libs/chatbot/openai/ChatGPT4o";
import ArkoseGlobalSingleton from "~libs/chatbot/openai/Arkose";

export type M = (
    typeof ChatGPT4oMiniAPI
    | typeof ChatGPT4oMiniAPI
    | typeof JihyeAPIStream
    )

export type Ms = M[]

export interface CMsItem {
    label: string;
    models: M[];
}
export type CMs = CMsItem[]

interface IModelManagementProvider {
    currentBots: Ms;
    setCurrentBots: React.Dispatch<React.SetStateAction<Ms>>;
    allModels: React.MutableRefObject<Ms>;
    categoryModels: React.MutableRefObject<CMs>;
    saveCurrentBotsKeyLocal: () => void;
}

export const ModelManagementContext = createContext({} as IModelManagementProvider);

export default function ModelManagementProvider({children}) {
    const defaultModels: Ms = [JihyeAPIStream];
    const [currentBots, setCurrentBots] = useState<IModelManagementProvider['currentBots']>(defaultModels);
    const allModels = useRef<Ms>([JihyeAPIStream, ChatGPT4oMiniAPI]);
    const storage = new Storage();
    const [isLoaded, setIsLoaded] = useState(false);
    const categoryModels = useRef<CMs>([
        {
            label: "ixi-Jihye",
            models: [JihyeAPIStream]
        },
        {
            label: "OpenAI",
            models: [ChatGPT4oMiniAPI]
        }
    ]);

    const handleModelStorge = async () => {
        try {
            const value = await storage.get<string[]>("currentModelsKey");
            Logger.log('local currentModels:', value);
            
            const arr: Ms = [];
            if (value && value.length) {
                value.forEach((ele) => {
                    Logger.log('checking model:', ele);
                    allModels.current.forEach((item) => {
                        Logger.log('comparing with:', item.botName);
                        if (item.botName === ele) {
                            arr.push(item);
                            Logger.log('model matched:', item.botName);
                        }
                    });
                });
                
                Logger.log('final models array:', arr);
                if (arr.length) {
                    setCurrentBots(arr);
                } else {
                    setCurrentBots(defaultModels);
                }
            }
        } catch (e) {
            Logger.error('Error in handleModelStorge:', e);
        }finally {
            setIsLoaded(true);
        }
    };

    useEffect(()=>{
        void handleModelStorge();
        // init arkose
        void ArkoseGlobalSingleton.getInstance().loadArkoseScript();
    },[]);

    const getCurrentModelKey = async () => {
        const cbots: Ms = await getLatestState(setCurrentBots);
        return cbots.map(model => model.botName);
    };

    const saveCurrentBotsKeyLocal = async () => {
        void storage.set("currentModelsKey", await getCurrentModelKey());
        Logger.log('s-get', storage.get("currentModelsKey"));
    };

    return (
        <ModelManagementContext.Provider value={{currentBots, allModels, categoryModels, setCurrentBots: setCurrentBots, saveCurrentBotsKeyLocal}}>
            {isLoaded && children}
        </ModelManagementContext.Provider>
    );
}
