import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div className="flex justify-center items-center h-screen w-screen bg-background mx-auto">
      <Outlet />
    </div>
  );
};

export default RootLayout;
