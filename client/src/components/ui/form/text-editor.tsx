import { FieldValues, useController, UseControllerProps } from "react-hook-form";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

import { FieldWrapper, FieldWrapperPassThroughProps } from "./FieldWrapper";

type TextEditorProps<TFieldValues extends FieldValues> =
  UseControllerProps<TFieldValues> & FieldWrapperPassThroughProps;

const QuillModules = {
  toolbar: [
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
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
}: TextEditorProps<TFieldValues>) => {
  const {
    field: { onChange, onBlur, value, ref },
  } = useController({
    name,
    control,
    defaultValue,
    // rules={{}}
  });

  console.log(value);

  return (
    <FieldWrapper label={label}>
      <ReactQuill
        theme="snow"
        className="custom-quill"
        modules={QuillModules}
        value={value || ""}
        onChange={onChange}
        onBlur={onBlur}
        ref={ref}
      />
    </FieldWrapper>
  );
};

export default TextEditor;
