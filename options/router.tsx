import React, {Fragment} from "react";
import {createBrowserRouter} from "react-router-dom";
import Index from "~options/pages";
import ShortcutMenu from "~options/pages/ShortcutMenu";
import Layout from "~options/layout";
import OptionsProvider from "~provider/Options";
import ApiKeyPage from "~options/pages/ApiKeyPage";

export const PATH_SETTING_SHORTCUT = "";
export const PATH_SETTING_APIKEY = "apikey";

export const router = createBrowserRouter([
    {
        path: "options.html",
        element: <Fragment>
            <OptionsProvider><Layout/></OptionsProvider>
        </Fragment>,
        children: [
            {
                path: PATH_SETTING_SHORTCUT,
                element: <ShortcutMenu/>,
            },
            {
                path: PATH_SETTING_APIKEY,
                element: <ApiKeyPage/>,
            },
        ],
    },
]);
