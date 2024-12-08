import {createBrowserRouter, useLocation} from "react-router-dom";
import Index from "~options/pages";
import ShortcutMenu from "~options/pages/ShortcutMenu";
import Layout from "~options/layout";
import OptionsProvider from "~provider/Options";
import {Fragment, useContext, useEffect} from "react";

export const PATH_SETTING_SIDEBAR = "path_shortcut";
export const PATH_SETTING_CONTACT_US = "path_contact_us";
export const PATH_SETTING_SHORTCUT = "";

export const router = createBrowserRouter([
    {
        path: "options.html",
        element: <Fragment>
            <OptionsProvider><Layout/></OptionsProvider>
        </Fragment>,
        children: [
            // {
            //     path: "",
            //     element: <DetermineRedirect/>,
            // },
            {
                path: PATH_SETTING_SIDEBAR,
                element: <Index/>,
            },
            {
                path: PATH_SETTING_SHORTCUT,
                element: <ShortcutMenu/>,
            },
        ],
    },
]);
