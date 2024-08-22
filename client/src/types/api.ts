import { InternalAxiosRequestConfig } from "axios";

export type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

export type BaseEntity = {
    id: string;
};

export type Entity<T> = {
    [K in keyof T]: T[K];
} & BaseEntity;

export type User = Entity<{
    firstName: string;
    lastName: string;
    email: string;
    enabled: boolean;
    role: "admin" | "user";
}>;
