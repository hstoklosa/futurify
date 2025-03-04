import { useRef, useState } from "react";
import { IconType } from "react-icons/lib";
import { LuPencil } from "react-icons/lu";

import { Input, type InputProps } from ".";

type ToggleInputProps = {
  icon?: IconType;
  onDisabledClick?: (_event: React.MouseEvent<HTMLDivElement>) => void;
} & InputProps;

const ToggleInput = ({
  icon: Icon = LuPencil,
  onDisabledClick,
  ...props
}: ToggleInputProps) => {
  const [enabled, setEnabled] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const enableInput = () => setEnabled(true);
  const disableInput = () => setEnabled(false);

  const onIconClick = () => {
    enableInput();
    inputRef.current?.focus();
  };

  const onInputBlur = () => {
    disableInput();
    inputRef.current?.blur();
  };

  return (
    <Input
      ref={inputRef}
      onBlur={onInputBlur}
      {...props}
    >
      {!enabled && (
        <>
          <div
            className="absolute inset-y-0 right-0 pr-3 flex items-center w-full h-full"
            onClick={(_e) => onDisabledClick && onDisabledClick(_e)}
          />

          <div
            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
            onClick={onIconClick}
          >
            <Icon className="stroke-primary/35" />
          </div>
        </>
      )}
    </Input>
  );
};

export default ToggleInput;
