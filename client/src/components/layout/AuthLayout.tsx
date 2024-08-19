import { useLocation, Navigate } from "react-router-dom";

import useAuthStatus from "@hooks/useAuthStatus";
import { Head } from "@components/seo";
import { PathConstants } from "@utils/constants";

type AuthLayoutProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

const AuthLayout = ({ title, subtitle, children }: AuthLayoutProps) => {
  const { isAuthenticated, isVerified } = useAuthStatus();
  const location = useLocation();

  if (
    isAuthenticated &&
    !isVerified &&
    location.pathname !== PathConstants.VERIFY_ACCOUNT
  ) {
    return (
      <Navigate
        to={PathConstants.VERIFY_ACCOUNT}
        replace
      />
    );
  }

  if (isAuthenticated && isVerified) {
    return (
      <Navigate
        to={PathConstants.HOME}
        replace
      />
    );
  }

  return (
    <>
      <Head title={title} />
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div className="w-[100%] max-w-[325px]">
          <h1 className="text-foreground text-4xl font-bold mb-3">{title}</h1>
          <h2 className="text-foreground/80 text-xl mb-5">{subtitle}</h2>
          {children}
        </div>
      </div>
    </>
  );
};

export default AuthLayout;
