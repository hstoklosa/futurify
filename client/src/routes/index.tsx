import React from "react";
import { createBrowserRouter, RouteObject } from "react-router-dom";

import Root from "./Root";
import Page404 from "./Page404";

const routes: RouteObject[] = [];

const router = createBrowserRouter([
    {
        element: <Root />,
        errorElement: <Page404 />,
        children: routes,
    },
]);

export default router;
