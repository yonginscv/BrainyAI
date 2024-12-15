import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { Storage } from "@plasmohq/storage";

export default function ApiKeyPage() {
    const [form] = Form.useForm();
    const storage = new Storage();

    React.useEffect(() => {
        // 저장된 API 키들을 불러옵니다
        async function loadApiKeys() {
            const openaiKey = await storage.get('openai-api-key');
            const jiheyKey = await storage.get('jihey-api-key');
            form.setFieldsValue({
                'openai-api-key': openaiKey,
                'jihey-api-key': jiheyKey
            });
        }
        loadApiKeys();
    }, []);

    const onFinish = async (values: any) => {
        try {
            // OpenAI API 키가 입력된 경우에만 저장
            if (values['openai-api-key']) {
                await storage.set('openai-api-key', values['openai-api-key']);
            }
            // Jihye JWT 토큰이 입력된 경우에만 저장
            if (values['jihey-api-key']) {
                await storage.set('jihey-api-key', values['jihey-api-key']);
            }
            
            // 둘 다 비어있는 경우 에러 메시지 표시
            if (!values['openai-api-key'] && !values['jihey-api-key']) {
                message.error('최소한 하나의 API 키를 입력해주세요.');
                return;
            }
            
            message.success('API 키가 저장되었습니다.');
        } catch (error) {
            message.error('API 키 저장에 실패했습니다.');
        }
    };

    return (
        <div className="p-4">
            <Form form={form} onFinish={onFinish} layout="vertical">
                <Form.Item
                    label="OpenAI API Key (추후 Madang AI key 로 입력가능합니다)"
                    name="openai-api-key"
                >
                    <Input.Password placeholder="sk-..." />
                </Form.Item>
                
                <Form.Item
                    label="Jihye JWT Token (jihye.ucube.lgudax.cool 에서 받으셔요)"
                    name="jihey-api-key"
                >
                    <Input.Password placeholder="Jihye JWT Token을 입력해주세요" />
                </Form.Item>

                <Form.Item>
                    <Button 
                        type="primary" 
                        htmlType="submit"
                        className="z-10 relative bg-green-600 hover:bg-green-700"
                        style={{ backgroundColor: '#10B981' }}
                    >
                        저장
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
} 