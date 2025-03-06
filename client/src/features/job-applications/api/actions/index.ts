import { api } from "@lib/api-client";
import { MutationConfig, QueryConfig } from "@lib/react-query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { actionQueryKeys } from "./action-query-keys";

export enum ActionType {
  PREPARE_COVER_LETTER = "PREPARE_COVER_LETTER",
  PREPARE_RESUME = "PREPARE_RESUME",
  REACH_OUT = "REACH_OUT",
  GET_REFERENCE = "GET_REFERENCE",
  APPLY = "APPLY",
  FOLLOW_UP = "FOLLOW_UP",
  PREPARE_FOR_INTERVIEW = "PREPARE_FOR_INTERVIEW",
  PHONE_SCREEN = "PHONE_SCREEN",
  PHONE_INTERVIEW = "PHONE_INTERVIEW",
  ON_SITE_INTERVIEW = "ON_SITE_INTERVIEW",
  OFFER_RECEIVED = "OFFER_RECEIVED",
  ACCEPT_OFFER = "ACCEPT_OFFER",
  DECLINE_OFFER = "DECLINE_OFFER",
  REJECTED = "REJECTED",
  EMAIL = "EMAIL",
  MEETING = "MEETING",
  PHONE_CALL = "PHONE_CALL",
  SEND_AVAILABILITY = "SEND_AVAILABILITY",
  ASSIGNMENT = "ASSIGNMENT",
  NETWORKING_EVENT = "NETWORKING_EVENT",
  OTHER = "OTHER",
  WITHDRAWAL = "WITHDRAWAL",
}

export type Action = {
  id: number;
  title: string;
  type: ActionType;
  startDateTime: string;
  endDateTime: string;
  color?: string;
  notes?: string;
  completed: boolean;
  jobId: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateActionDTO = {
  title: string;
  type: ActionType;
  startDateTime: string;
  endDateTime: string;
  color?: string;
  notes?: string;
  completed?: boolean;
};

export type UpdateActionDTO = Partial<CreateActionDTO>;

// Get actions for a job
const getActions = (jobId: number) => {
  return api.get<Action[]>(`/actions/job/${jobId}`);
};

export const useActions = (
  jobId: number,
  config: QueryConfig<typeof getActions> = {} as QueryConfig<typeof getActions>
) => {
  return useQuery({
    ...config,
    queryKey: actionQueryKeys.list(jobId),
    queryFn: () => getActions(jobId),
  });
};

// Get single action
const getAction = (actionId: number) => {
  return api.get<Action>(`/actions/${actionId}`);
};

export const useAction = (
  actionId: number,
  config: QueryConfig<typeof getAction> = {} as QueryConfig<typeof getAction>
) => {
  return useQuery({
    ...config,
    queryKey: actionQueryKeys.detail(actionId),
    queryFn: () => getAction(actionId),
  });
};

// Create action
type CreateActionData = {
  jobId: number;
  data: CreateActionDTO;
};

const createAction = ({ jobId, data }: CreateActionData) => {
  return api.post(`/actions/job/${jobId}`, data);
};

export const useCreateAction = ({
  onSuccess,
  ...rest
}: MutationConfig<typeof createAction>) => {
  const queryClient = useQueryClient();

  return useMutation({
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: actionQueryKeys.list(variables.jobId),
      });

      onSuccess?.(data, variables, undefined);
    },
    meta: {
      showToast: true,
      toastMessage: "Failed to create action. Please try again.",
    },
    mutationFn: createAction,
    ...rest,
  });
};

// Update action
type UpdateActionData = {
  actionId: number;
  jobId: number;
  data: UpdateActionDTO;
};

const updateAction = ({ actionId, data }: UpdateActionData) => {
  return api.put(`/actions/${actionId}`, data);
};

export const useUpdateAction = ({
  onSuccess,
  ...rest
}: MutationConfig<typeof updateAction>) => {
  const queryClient = useQueryClient();

  return useMutation({
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: actionQueryKeys.detail(variables.actionId),
      });
      queryClient.invalidateQueries({
        queryKey: actionQueryKeys.list(variables.jobId),
      });

      onSuccess?.(data, variables, undefined);
    },
    meta: {
      showToast: true,
      toastMessage: "Failed to update action. Please try again.",
    },
    mutationFn: updateAction,
    ...rest,
  });
};

// Delete action
type DeleteActionData = {
  actionId: number;
  jobId: number;
};

const deleteAction = ({ actionId }: DeleteActionData) => {
  return api.delete(`/actions/${actionId}`);
};

export const useDeleteAction = ({
  onSuccess,
  ...rest
}: MutationConfig<typeof deleteAction>) => {
  const queryClient = useQueryClient();

  return useMutation({
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: actionQueryKeys.list(variables.jobId),
      });

      onSuccess?.(data, variables, undefined);
    },
    meta: {
      showToast: true,
      toastMessage: "Failed to delete action. Please try again.",
    },
    mutationFn: deleteAction,
    ...rest,
  });
};
