const NotFound = () => {
    return (
        <div className="bg-background flex flex-col justify-center items-center h-screen w-screen">
            <div className="flex flex-col justify-center items-center  text-center">
                <h3 className="text-foreground text-base font-semibold mb-1">404</h3>
                <h1 className="text-foreground text-6xl font-bold mb-3">
                    Page not found
                </h1>
                <p className="text-foreground text-lg w-[70%] min-w-[350px]">
                    We couldn't find the page you were looking for. You can return to
                    our home page, or drop us a line if you can't find what you're
                    looking for.
                </p>
            </div>
        </div>
    );
};

export default NotFound;
