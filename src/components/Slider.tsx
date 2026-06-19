import type { Component, JSX, Accessor, Setter } from "solid-js";
import LabeledInput from "./LabeledInput";

interface SliderProps {
  id: string;
  value: Accessor<number>;
  setValue?: Setter<number>;
  min?: number;
  max?: number;
  step?: number;
  labelTemplate?: string;
  disabled?: boolean;
}

const Slider: Component<SliderProps> = (props): JSX.Element => {
  return (
    <LabeledInput
      id={props.id}
      type="range"
      value={props.value}
      setValue={props.setValue}
      labelTemplate={props.labelTemplate}
      min={props.min}
      max={props.max}
      step={props.step}
      disabled={props.disabled}
    />
  );
};

export default Slider;
