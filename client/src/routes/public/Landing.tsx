import stars from "@assets/stars.svg";
import { Link } from "react-router-dom";

import { Button } from "@components/ui/button";
import PathConstants from "@/utils/pathConstants";

const Landing = () => {
    return (
        <div className="flex flex-col justify-center items-center">
            <h1 className="flex items-center text-5xl text-primary-foreground">
                <img
                    src={stars}
                    className="w-10 mx-3"
                    alt="Stars Emoji Image"
                />
                <span className="font-bold p-2 bg-[rgba(106,79,235,0.3)] rounded-2xl">
                    AI
                </span>
                <span className="mx-2">POWERED</span>
                <img
                    src={stars}
                    className="w-10 mx-3 fill-primary"
                    alt="Stars Emoji Image"
                />
            </h1>

            <div className="flex text-center flex-col items-center justify-center max-w-2xl">
                <h1 className="text-primary-foreground text-6xl my-3 font-extrabold">
                    Manage Your Interviews Like a Pro
                </h1>
                <p className="text-primary-foreground/80 text-xl">
                    Stay organized throughout your job search journey and never miss
                    an interview with our comprehensive AI-powered interview tracking
                    and management tool.
                </p>
            </div>

            <div className="flex items-center justify-center mt-6">
                <Link to={PathConstants.SIGN_IN}>
                    <Button className="mr-2">Get Started</Button>
                </Link>
                <Button
                    variant="outline"
                    className="cursor-not-allowed"
                    disabled
                >
                    Watch Video
                </Button>
            </div>
        </div>
    );
};

export default Landing;
