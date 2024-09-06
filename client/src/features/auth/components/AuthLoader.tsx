import { useUser } from "../api/getUser";

type AuthLoaderProps = {
  renderLoading: () => React.ReactNode;
  children: React.ReactNode;
};

const AuthLoader = ({ renderLoading, children }: AuthLoaderProps) => {
  const { isFetched } = useUser();

  if (!isFetched) {
    return renderLoading();
  }

  return <>{children}</>;
};

export default AuthLoader;
