import { Suspense } from "react";
import { Outlet } from "react-router-dom";

import { useUser } from "@features/auth/api/getUser";
import { Spinner } from "@components/ui/spinner";

const Root = () => {
  const user = useUser();

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-background mx-auto">
      <Suspense fallback={<Spinner size="lg" />}>
        {!user.isFetched ? <Spinner size="lg" /> : <Outlet />}
      </Suspense>
    </div>
  );
};

export default Root;
