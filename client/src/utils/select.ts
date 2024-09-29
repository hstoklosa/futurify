export const renderOptions = <T extends { [key: string]: any }>(
  data: T[],
  labelKey: keyof T = "label",
  valueKey: keyof T = "value"
) => {
  return data.map((item) => ({
    label: String(item[labelKey]),
    value: String(item[valueKey]),
  }));
};
