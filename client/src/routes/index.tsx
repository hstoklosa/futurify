import React from "react";
import { createBrowserRouter, RouteObject } from "react-router-dom";

import Root from "./Root";
import Page404 from "./Page404";

const Home = React.lazy(() => import("./public/Home"));

import PathConstants from "@utils/pathConstants";

const routes: RouteObject[] = [
    {
        path: PathConstants.HOME,
        element: <Home />,
        index: true,
    },
];

const router = createBrowserRouter([
    {
        element: <Root />,
        errorElement: <Page404 />,
        children: routes,
    },
]);

export default router;
