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
  stages: Stage[];
}>;

export type BoardList = Board[];

export type Stage = Omit<
  Entity<{
    name: string;
    order: number;
  }>,
  "createdAt" | "updatedAt"
>;

export type Application = Omit<
  Entity<{
    stageId: number;
    title: string;
    company: string;
  }>,
  "createdAt" | "updatedAt"
>;
