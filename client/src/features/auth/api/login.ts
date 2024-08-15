import React from "react";
import {
    useMutation,
    UseMutationOptions,
    useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

import { api } from "@lib/api-client";
import { LoginInput } from "@types/auth";
import { User } from "@types/api";
import { USER_KEY } from "@utils/constants";

const login = async (data: LoginInput): Promise<User> => {
    const response = await api.post("/auth/login", data);
    return response.data;
};

export const useLogin = (
    options?: Omit<UseMutationOptions<User, AxiosError, LoginInput>, "mutationFn">
) => {
    const queryClient = useQueryClient();

    const setUser = React.useCallback(
        (data: User) => queryClient.setQueryData(USER_KEY, data),
        [queryClient]
    );

    return useMutation({
        mutationFn: login,
        ...options,
        onSuccess: (data) => {
            setUser(data);
        },
    });
};
