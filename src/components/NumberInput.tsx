import type { Component, Accessor, Setter } from "solid-js";
import LabeledInput from "./LabeledInput";

interface NumberInputProps {
  id: string;
  value: Accessor<number>;
  setValue?: Setter<number>;
  placeholder?: string;
  labelTemplate?: string;
  disabled?: boolean;
}

const NumberInput: Component<NumberInputProps> = (props) => {
  return (
    <LabeledInput
      id={props.id}
      type="number"
      value={props.value}
      setValue={props.setValue}
      labelTemplate={props.labelTemplate}
      placeholder={props.placeholder}
      disabled={props.disabled}
    />
  );
};

export default NumberInput;
