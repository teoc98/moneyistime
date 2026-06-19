import type { Component, JSX, Accessor, Setter } from "solid-js";

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
  const formatValue = (val: number): string => {
    const step = props.step ?? 1;
    return step < 1 ? val.toFixed(2) : val.toString();
  };

  return (
    <div>
      <label for={props.id}>
        {(props.labelTemplate ?? "{value}").replace(
          "{value}",
          formatValue(props.value()),
        )}
      </label>
      <input
        type="range"
        id={props.id}
        name={props.id}
        min={props.min ?? 0}
        max={props.max}
        step={props.step ?? 1}
        value={props.value()}
        disabled={props.disabled}
        onInput={(e) => props.setValue?.(parseFloat(e.currentTarget.value))}
      />
    </div>
  );
};

export default Slider;
