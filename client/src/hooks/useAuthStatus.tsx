import { useUser } from "@/features/auth/api/getUser";

const useAuthStatus = () => {
    const user = useUser();

    const isAuthenticated = !!user.data;
    const isVerified = user.data?.enabled;

    return { isAuthenticated, isVerified };
};

export default useAuthStatus;
