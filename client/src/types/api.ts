import { InternalAxiosRequestConfig } from "axios";

export type RetryableRequestConfig = {
  _retry?: boolean;
} & InternalAxiosRequestConfig;

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

export type Board = Entity<{
  name: string;
  archived: boolean;
}>;

export type BoardList = Board[];
