import type { Component } from "solid-js";
import { createSignal } from "solid-js";
import Slider from "./components/Slider";

const App: Component = () => {
  const [workingHours, setWorkingHours] = createSignal(8);

  return (
    <>
      <h1>Hello world!!!!</h1>
      <Slider
        id="working_hours_day"
        value={workingHours}
        setValue={setWorkingHours}
        min={0}
        max={24}
        step={0.25}
        labelTemplate="Working {value} hours/day"
      />
    </>
  );
};

export default App;
