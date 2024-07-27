import { Suspense } from "react";
import { Outlet } from "react-router-dom";

const Root = () => {
    return (
        <div className="flex justify-center items-center h-screen w-screen bg-background">
            <Suspense fallback={<div>Loading...</div>}>
                <Outlet />
            </Suspense>
        </div>
    );
};

export default Root;
