import React from "react";
const ProgressProvider = (props: ProgressProviderProps) => {
  const [value, setValue] = React.useState(props.valueStart);
  React.useEffect(() => {
    setTimeout(() => setValue(props.valueEnd), 100);
  }, [props.valueEnd]);

  return props.children(value);
};
export default ProgressProvider;

interface ProgressProviderProps {
  children: (value: number) => JSX.Element;
  valueStart: number;
  valueEnd: number;
}
