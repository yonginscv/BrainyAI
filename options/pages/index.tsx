import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import AiEnginePage from "~options/component/AiEnginePage";
import ApiKeyPage from "~options/pages/ApiKeyPage";

export default function Index() {
    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Shortcut Menu',
            children: <AiEnginePage />,
        },
        {
            key: '2',
            label: 'API Key 설정',
            children: <ApiKeyPage />,
        },
    ];

    return (
        <div className={'max-w-[1206px] m-auto'}>
            <Tabs defaultActiveKey="1" items={items} />
        </div>
    );
}
