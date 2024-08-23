import React from "react";
import { createBrowserRouter, RouteObject } from "react-router-dom";

import Root from "./Root";
import ProtectedRoute from "./app/ProtectedRoute";
import AppLayout from "@components/layout/AppLayout";
import { PathConstants } from "@utils/constants";

const NotFound = React.lazy(() => import("./app/NotFound"));
const Landing = React.lazy(() => import("./app/Landing"));
const SignUp = React.lazy(() => import("./app/auth/SignUp"));
const SignIn = React.lazy(() => import("./app/auth/SignIn"));
const VerifyAccount = React.lazy(() => import("./app/auth/VerifyAccount"));
const Home = React.lazy(() => import("./app/dashboard/Home"));

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
  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: PathConstants.HOME,
        element: <Home />,
      },
    ],
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
