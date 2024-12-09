import IconSearch from "data-base64:~assets/icon_search_ai.svg";
import IconMore from "data-base64:~assets/more.svg";
import {useContext, useEffect, useState} from "react";
import { Drawer, Tooltip, type DrawerProps} from "antd";
import DrawerNaviItem from "~component/sidepanel/DrawerNaviItem";
import IconSearchActive from "data-base64:~assets/icon_search_ai_active.svg";
import IconChat from "data-base64:~assets/chat.svg";
import IconSetting from "data-base64:~assets/setting.svg";
import IconChatActive from "data-base64:~assets/chat_active.svg";
import {PanelRouterPath} from "~libs/constants";
import {useLocation, useNavigate} from "react-router-dom";
import NewChatIcon from "data-base64:~assets/new_chat.svg";
import MenuArrowIcon from "data-base64:~assets/menu_arrow.svg";
import eventBus from "~libs/EventBus";

export interface IDrawerNaviItem {
    path: PanelRouterPath
    name: string
    icon: string
    activeIcon: string
}

const DrawerNaviItems: IDrawerNaviItem[] = [
    {path: PanelRouterPath.CONVERSATION, name: "Chat", icon:  IconChat, activeIcon: IconChatActive},
    {path: PanelRouterPath.SEARCH_HOME, name: "Search", icon:  IconSearch, activeIcon: IconSearchActive},
];


const HTitle = {
    AIChatText: "AI Chat",
    AISearchText: "AI Search",
};

export default function () {
    const [open, setOpen] = useState(false);
    const [placement] = useState<DrawerProps['placement']>('right');
    const location = useLocation();
    const navigate = useNavigate();
    const [, setTitleImage] = useState<string>();
    const [titleText, setTitleText] = useState<string>();

    useEffect(() => {
        if(location.pathname.endsWith(PanelRouterPath.CONVERSATION)) {
            setTitleImage(IconChat);
            setTitleText(HTitle.AIChatText);
        } else {
            setTitleImage(IconSearch);
            setTitleText(HTitle.AISearchText);
        }
    }, [location]);


    // const showDrawer = () => {
    //     setOpen(true);
    // };
    //
    // const onChange = (e: RadioChangeEvent) => {
    //     setPlacement(e.target.value);
    // };


    const newChatClick = () => {
        eventBus.emit('newChat');
    };



    return <div className={"h-[52px] box-border flex-0 flex-shrink-0 flex-grow-0 w-full flex justify-between items-center px-[16px]"}>

        <div className={'flex items-center font-[#333333] text-[20px] font-[600]'}>
            {titleText}
        </div>
        <div className='flex justify-end items-center'>
            <Tooltip title='New Chat'>
                {titleText === HTitle.AIChatText && <img  className='w-[22px] mr-4 cursor-pointer' src={NewChatIcon} onClick={newChatClick} alt=""/>}
            </Tooltip>
        </div>
    </div>;
}
