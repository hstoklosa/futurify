import { useUser } from "@/features/auth/api/get-user";

const useAuthStatus = () => {
  const { data: currentUser } = useUser();

  const isAuthenticated = !!currentUser?.data;
  const isVerified = isAuthenticated && currentUser.data.enabled;

  return { isAuthenticated, isVerified };
};

export default useAuthStatus;
