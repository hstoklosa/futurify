import React from "react";
import { createBrowserRouter, RouteObject } from "react-router-dom";

import Root from "./Root";

const Page404 = React.lazy(() => import("./public/Page404"));
const Landing = React.lazy(() => import("./public/Landing"));

import PathConstants from "@utils/pathConstants";

const routes: RouteObject[] = [
    {
        path: PathConstants.LANDING,
        element: <Landing />,
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
