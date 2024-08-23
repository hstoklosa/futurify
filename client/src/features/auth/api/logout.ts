import React from "react";
import { AxiosError } from "axios";
import {
    useMutation,
    UseMutationOptions,
    useQueryClient,
} from "@tanstack/react-query";
import { api } from "@lib/api-client";
import { User } from "@types/api";
import { USER_KEY } from "@utils/constants";

const logout = (): Promise<unknown> => {
    return api.post("/auth/logout");
};

export const useLogout = (
    options?: Omit<UseMutationOptions<unknown, AxiosError, unknown>, "mutationFn">
) => {
    const queryClient = useQueryClient();

    const setUser = React.useCallback(
        (data: User | null) => queryClient.setQueryData(USER_KEY, data),
        [queryClient]
    );

    return useMutation({
        mutationFn: logout,
        ...options,
        onSuccess: () => {
            setUser(null);
            console.log("logged out");
        },
    });
};
