import { FieldValues, useController, UseControllerProps } from "react-hook-form";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

import { FieldWrapper, FieldWrapperPassThroughProps } from "./field-wrapper";

type TextEditorProps<TFieldValues extends FieldValues> =
  UseControllerProps<TFieldValues> &
    FieldWrapperPassThroughProps & {
      actions?: React.ReactNode;
    };

const QuillModules = {
  toolbar: [
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
  ],
};

/*
 * REF:
 * Using Controller from RHF - https://github.com/zenoamaro/react-quill/issues/635
 * useController for reusable component - https://www.react-hook-form.com/api/usecontroller/
 */
const TextEditor = <TFieldValues extends FieldValues>({
  name,
  label,
  control,
  defaultValue,
  actions,
}: TextEditorProps<TFieldValues>) => {
  const {
    field: { onChange, onBlur, value, ref },
  } = useController({
    name,
    control,
    defaultValue,
    // rules={{}}
  });

  return (
    <FieldWrapper label={label}>
      <div className="relative">
        <ReactQuill
          theme="snow"
          className="custom-quill"
          modules={QuillModules}
          value={value || ""}
          onChange={onChange}
          onBlur={onBlur}
          ref={ref}
        />
        {actions && <div className="absolute bottom-4 right-4">{actions}</div>}
      </div>
    </FieldWrapper>
  );
};

export default TextEditor;
