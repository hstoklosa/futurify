import { useMutation } from "@tanstack/react-query";
import { api } from "@lib/api-client";
import { MutationConfig } from "@lib/react-query";

export type ContactMessageInput = {
  title: string;
  message: string;
};

const sendContactMessage = async (
  data: ContactMessageInput
): Promise<{ data: string }> => {
  return api.post("/contact", data);
};

export const useSendContactMessage = (
  config: Omit<MutationConfig<typeof sendContactMessage>, "mutationFn"> = {}
) => {
  return useMutation({
    mutationFn: sendContactMessage,
    meta: {
      showToast: true,
      toastMessage: "Message sent successfully",
    },
    ...config,
  });
};
