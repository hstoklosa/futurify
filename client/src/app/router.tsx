import React from "react";
import { createBrowserRouter, RouterProvider, RouteObject } from "react-router-dom";

import { RootLayout, AppLayout } from "@components/layout";
import { PathConstants } from "@utils/constants";
import ProtectedRoute from "./routes/ProtectedRoute";

const NotFound = React.lazy(() => import("./routes/NotFound"));
const Landing = React.lazy(() => import("./routes/Landing"));
const SignUp = React.lazy(() => import("./routes/auth/SignUp"));
const SignIn = React.lazy(() => import("./routes/auth/SignIn"));
const VerifyAccount = React.lazy(() => import("./routes/auth/VerifyAccount"));
const Home = React.lazy(() => import("./routes/dashboard/Home"));
const ArchivedBoards = React.lazy(() => import("./routes/dashboard/ArchivedBoards"));

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

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
