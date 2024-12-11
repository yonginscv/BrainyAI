import React, { useState } from 'react';
import { Button, Input, message } from 'antd';
import { useStorage } from "@plasmohq/storage/dist/hook";
import { Logger } from "~utils/logger";

export default function ApiKeyPage() {
    const [apiKey, setApiKey] = useStorage('openai-api-key', '');
    const [inputValue, setInputValue] = useState('');
    const [messageApi, contextHolder] = message.useMessage();

    const handleSave = () => {
        if (!inputValue.trim()) {
            void messageApi.warning('API Key를 입력해주세요.');
            return;
        }

        void setApiKey(inputValue.trim());
        void messageApi.success('API Key가 저장되었습니다.');
        Logger.log('API Key saved:', inputValue);
    };

    return (
        <div className={'bg-white shadow-[0_4px_12px_0px_rgba(0,0,0,.2)] overflow-hidden rounded-tl-[24px] rounded-tr-[24px] px-[56px] py-[32px] mt-[32px] flex flex-col'}>
            {contextHolder}
            <div className={'text-[#333333] font-[700] text-[20px] justify-start'}>
                API Key 설정
            </div>
            <div className={'text-[#5E5E5E] font-[400] text-[12px] justify-start mt-[8px]'}>
                OpenAI API Key를 입력해주세요.
            </div>
            
            <div className={'mt-[32px] flex flex-col gap-[16px]'}>
                <Input.Password
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="OpenAI API Key를 입력하세요"
                    className={'h-[40px]'}
                />
                
                <Button 
                    onClick={handleSave}
                    type="primary"
                    className={'bg-[#0A4DFE] h-[40px] w-[120px]'}>
                    저장
                </Button>
            </div>
        </div>
    );
} 