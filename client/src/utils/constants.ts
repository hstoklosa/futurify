import { QueryKey } from "@tanstack/react-query";

export const PathConstants = {
  LANDING: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  VERIFY_ACCOUNT: "/verify-account",
  HOME: "/home",
  ARCHIVED_BOARDS: "/home/archived-boards",
  BOARD_VIEW: (id: string | number) => `/board/${id}`,
};

export const USER_KEY: QueryKey = ["user"];
