import React, {createContext, useEffect, useRef, useState} from "react";
import {getLatestState} from "~utils";
import {CopilotBot} from "~libs/chatbot/copilot";
import ChatGPT35Turbo from "~libs/chatbot/openai/ChatGPT35Turbo";
import {Storage} from "@plasmohq/storage";
import  ChatGPT4Turbo from "~libs/chatbot/openai/ChatGPT4Turbo";
import ChatGPT4oMiniAPI from "~libs/chatbot/openai/ChatGPT4o-miniAPI";
import {Logger} from "~utils/logger";
import ChatGPT4O from "~libs/chatbot/openai/ChatGPT4o";
import ArkoseGlobalSingleton from "~libs/chatbot/openai/Arkose";

export type M = (
    typeof ChatGPT35Turbo
    | typeof CopilotBot
    | typeof ChatGPT4Turbo
    | typeof ChatGPT4O
    | typeof ChatGPT4oMiniAPI
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
    const defaultModels: Ms = [ChatGPT35Turbo];
    const [currentBots, setCurrentBots] = useState<IModelManagementProvider['currentBots']>(defaultModels);
    const allModels = useRef<Ms>([ChatGPT35Turbo, ChatGPT4O, ChatGPT4Turbo, CopilotBot]);
    const storage = new Storage();
    const [isLoaded, setIsLoaded] = useState(false);
    const categoryModels = useRef<CMs>([
        {
            label: "OpenAI",
            models: [ChatGPT35Turbo, ChatGPT4Turbo, ChatGPT4O, ChatGPT4oMiniAPI]
        },
        {
            label: "Microsoft",
            models: [CopilotBot]
        }]
    );

    const handleModelStorge = async () => {
        try {
            const value = await storage.get<string[]>("currentModelsKey");

            const arr: Ms = [];

            if (value && value.length) {
                Logger.log('local currentModels:',value);
                value.forEach((ele) => {
                    allModels.current.forEach((item) => {
                        if (item.botName === ele) {
                            arr.push(item);
                        }
                    });
                });

                if (arr.length) {
                    setCurrentBots(arr);
                }else {
                    setCurrentBots(defaultModels);
                }
            }
        }catch (e) {
            // ignore
        }
        finally {
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
