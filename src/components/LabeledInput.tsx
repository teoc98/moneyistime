import type { Component, JSX, Accessor, Setter } from "solid-js";

import type { Formatter } from "../types/Formatter";

interface LabeledInputProps {
  id: string;
  type: "range" | "number";
  value: Accessor<number>;
  setValue?: Setter<number>;
  labelTemplate?: string;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  placeholder?: string;
  formatter?: Formatter;
}

const LabeledInput: Component<LabeledInputProps> = (props): JSX.Element => {
  const formatValue = (val: number): string => {
    return props.formatter?.format(val) ?? val.toString();
  };

  const parts = () => {
    const template = props.labelTemplate ?? "{value}";
    const idx = template.indexOf("{value}");
    return {
      before: template.slice(0, idx),
      value: formatValue(props.value() || 0),
      after: template.slice(idx + 7),
    };
  };

  return (
    <div>
      <label for={props.id}>
        {parts().before}
        <strong>{parts().value}</strong>
        {parts().after}
      </label>
      <input
        type={props.type}
        id={props.id}
        name={props.id}
        min={props.min ?? 0}
        max={props.max}
        step={props.step ?? 1}
        value={props.value() || 0}
        disabled={props.disabled}
        placeholder={props.placeholder}
        onInput={(e) =>
          props.setValue?.(parseFloat(e.currentTarget.value) || 0)
        }
      />
    </div>
  );
};

export default LabeledInput;
