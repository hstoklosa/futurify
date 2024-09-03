import { InternalAxiosRequestConfig } from "axios";

export type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

export type Response<TData> = {
  data?: TData;
  error?: {
    message: string;
    path: string;
    errors: Record<string, string>;
  };
};

export type BaseEntity = {
  id: number;
  createdAt: string;
  updatedAt: string;
};

export type Entity<T> = {
  [K in keyof T]: T[K];
} & BaseEntity;

export type User = Entity<{
  firstName: string;
  lastName: string;
  email: string;
  enabled: boolean;
  avatar?: string;
  role: "admin" | "user";
}>;
