import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { TbUserFilled } from "react-icons/tb";

import { cn } from "@utils/cn";

const AvatarRoot = AvatarPrimitive.Root;
const AvatarImage = AvatarPrimitive.Image;
const AvatarFallback = AvatarPrimitive.Fallback;

type AvatarProps = {
  src?: string;
  alt?: string;
  className?: string;
};

const Avatar = ({ src, alt, className }: AvatarProps) => {
  return (
    <AvatarRoot
      data-testid="avatar-root"
      className={cn(
        "inline-flex items-center justify-center w-5 h-5 border-border border-[1px] rounded-full select-none overflow-hidden align-middle",
        className
      )}
    >
      <AvatarImage
        data-testid="avatar-image"
        className="w-full h-full rounded-full object-cover"
        src={src}
        alt={alt}
      />
      <AvatarFallback
        data-testid="avatar-fallback"
        className="w-3/4 h-3/4"
        asChild
      >
        <TbUserFilled className="stroke-primary stroke-width-[0.2px] fill-primary/50" />
      </AvatarFallback>
    </AvatarRoot>
  );
};

export default Avatar;
