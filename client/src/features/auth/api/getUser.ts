import { useQuery } from "@tanstack/react-query";
import { api } from "@lib/api-client";

import { User } from "@/types/api";
import { USER_KEY } from "@utils/constants";

const getUser = async (): Promise<{ data: User }> => {
  return api.get("/auth/me");
};

export const useUser = () => {
  return useQuery({
    queryKey: USER_KEY,
    queryFn: getUser,
  });
};
