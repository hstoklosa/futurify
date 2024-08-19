import React from "react";
import { createBrowserRouter, RouteObject } from "react-router-dom";

import Root from "./Root";
import { PathConstants } from "@utils/constants";

const NotFound = React.lazy(() => import("./public/NotFound"));
const Landing = React.lazy(() => import("./public/Landing"));
const SignUp = React.lazy(() => import("./public/SignUp"));
const SignIn = React.lazy(() => import("./public/SignIn"));
const VerifyAccount = React.lazy(() => import("./public/VerifyAccount"));

const routes: RouteObject[] = [
  {
    path: PathConstants.LANDING,
    element: <Landing />,
    index: true,
  },
  {
    path: PathConstants.SIGN_UP,
    element: <SignUp />,
  },
  {
    path: PathConstants.SIGN_IN,
    element: <SignIn />,
  },
  {
    path: PathConstants.VERIFY_ACCOUNT,
    element: <VerifyAccount />,
  },
];

const router = createBrowserRouter([
  {
    element: <Root />,
    errorElement: <NotFound />,
    children: routes,
  },
]);

export default router;
