import { useRouteError } from "react-router-dom";

const ErrorBoundary = () => {
  const error = useRouteError();
  console.log(error);
  return <div>Errors errors</div>;
};

export default ErrorBoundary;
