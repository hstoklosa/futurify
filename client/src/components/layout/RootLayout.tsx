import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div className="flex justify-center items-center h-screen w-full mx-auto overflow-hidden">
      <Outlet />
    </div>
  );
};

export default RootLayout;
