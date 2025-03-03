import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div className="flex justify-center items-center h-screen w-screen mx-auto">
      <Outlet />
    </div>
  );
};

export default RootLayout;
