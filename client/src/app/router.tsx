import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, useQueryClient } from "@tanstack/react-query";

import { RootLayout, AppLayout } from "@components/layout";
import { PathConstants } from "@utils/constants";

import ProtectedRoute from "./routes/ProtectedRoute";

/*
 * PUBLIC ROUTES
 */
const NotFound = React.lazy(() => import("./routes/NotFound"));
const Landing = React.lazy(() => import("./routes/Landing"));
const SignUp = React.lazy(() => import("./routes/auth/SignUp"));
const SignIn = React.lazy(() => import("./routes/auth/SignIn"));
const VerifyAccount = React.lazy(() => import("./routes/auth/VerifyAccount"));

/*
 * PROTECTED ROUTES
 */
const Home = React.lazy(() => import("./routes/dashboard/Home"));
const ArchivedBoards = React.lazy(() => import("./routes/dashboard/ArchivedBoards"));
const Board = React.lazy(() => import("./routes/dashboard/Board"));

const createAppRouter = (queryClient: QueryClient) =>
  createBrowserRouter([
    {
      element: <RootLayout />,
      errorElement: <NotFound />,
      children: [
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
            {
              path: PathConstants.BOARD_VIEW(":id"),
              element: <Board />,
              // loader: async (args: LoaderFunctionArgs) => {
              //   const { boardLoader } = await import("./routes/dashboard/Board");
              //   return boardLoader(queryClient)(args);
              // },
            },
          ],
        },
      ],
    },
  ]);

// TODO: Consider useMemo for router creation.
const AppRouter = () => {
  const queryClient = useQueryClient();
  const router = createAppRouter(queryClient);
  return <RouterProvider router={router} />;
};

export default AppRouter;
