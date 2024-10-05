import { InternalAxiosRequestConfig } from "axios";
import { JobType } from "@schemas/job-application";

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

export type Job = Entity<{
  title: string;
  companyName: string;
  location: string;
  type: JobType;
  description: string;
  postUrl: string;
  position: number;
  salary: string;
  stageId: number;
}>;
