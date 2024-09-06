import React from "react";
import { createBrowserRouter, RouteObject } from "react-router-dom";

import ProtectedRoute from "./app/ProtectedRoute";
import { RootLayout, AppLayout } from "@components/layout";
import { PathConstants } from "@utils/constants";

const NotFound = React.lazy(() => import("./app/NotFound"));
const Landing = React.lazy(() => import("./app/Landing"));
const SignUp = React.lazy(() => import("./app/auth/SignUp"));
const SignIn = React.lazy(() => import("./app/auth/SignIn"));
const VerifyAccount = React.lazy(() => import("./app/auth/VerifyAccount"));
const Home = React.lazy(() => import("./app/dashboard/Home"));
const ArchivedBoards = React.lazy(() => import("./app/dashboard/ArchivedBoards"));

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
      {
        path: PathConstants.ARCHIVED_BOARDS,
        element: <ArchivedBoards />,
      },
    ],
  },
];

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: routes,
  },
]);

export default router;
