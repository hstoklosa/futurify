import {
  DefaultOptions,
  QueryClient,
  MutationCache,
  QueryCache,
  UseMutationOptions,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

type CustomRQMeta = {
  showToast?: boolean;
  toastMessage?: string;
} & Record<string, unknown>;

declare module "@tanstack/react-query" {
  interface Register {
    queryMeta: CustomRQMeta;
    mutationMeta: CustomRQMeta;
  }
}

const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || error.message;
  }
  return error instanceof Error ? error.message : "An unexpected error occurred";
};

export const queryConfig = {
  queries: {
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 1000 * 60,
  },
} satisfies DefaultOptions;

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: queryConfig,
    mutationCache: new MutationCache({
      onError: (error, _variables, _context, mutation) => {
        if (mutation.options.onError) return;
        if (mutation.meta?.showToast !== false) {
          const message = mutation.meta?.toastMessage || getErrorMessage(error);
          toast.error(message);
        }

        console.error("[Mutation Error]:", error);
      },
    }),
    queryCache: new QueryCache({
      onError: (error, query) => {
        if (query.meta?.showToast !== false) {
          const message = query.meta?.toastMessage || getErrorMessage(error);
          toast.error(message);
        }

        console.error("[Query Error]:", error);
      },
    }),
  });

export type ApiFnReturnType<FnType extends (...args: any) => Promise<any>> =
  Awaited<ReturnType<FnType>>;

export type QueryConfig<T extends (...args: any[]) => any> = Omit<
  ReturnType<T>,
  "queryKey" | "queryFn"
>;

export type MutationConfig<MutationFnType extends (...args: any) => Promise<any>> =
  UseMutationOptions<
    ApiFnReturnType<MutationFnType>,
    AxiosError,
    Parameters<MutationFnType>[0]
  >;
