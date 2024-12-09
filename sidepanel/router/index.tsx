import {createBrowserRouter, Navigate, Outlet, useLocation, useNavigate,} from "react-router-dom";
import Conversation from "~sidepanel/pages/conversation";
import {PanelRouterPath} from "~libs/constants";
import React, {Fragment,  useContext, useEffect, useState} from "react";
import {OpenPanelType} from "~libs/open-ai/open-panel";
import Header from "~component/sidepanel/Header";

const DetermineRedirect = () => {
    const [defaultRoute, setDefaultRoute] = useState<string>();

    useEffect(() => {
            setDefaultRoute(PanelRouterPath.CONVERSATION);
    }, []);

    return <Fragment>
        {
            defaultRoute ? <Navigate to={defaultRoute} replace/> : null
        }
    </Fragment>;
};

const Container = function () {
    const navigate = useNavigate();
    const location = useLocation();


    return <Fragment>
        <Header/>
        <Outlet/>
    </Fragment>;
};

export const router = createBrowserRouter([
    {
        path: "sidepanel.html",
        element: <Container/>,
        children: [
            {
                path: "",
                element: <DetermineRedirect/>,
            },
            {
                path: PanelRouterPath.CONVERSATION,
                element: <Conversation/>,
            },
        ],
    },
]);
