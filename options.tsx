import {RouterProvider} from "react-router-dom";
import {router} from "~options/router";
import React from "react";
import '~base.scss';

export default function () {
    return <RouterProvider router={router}/>;
}
