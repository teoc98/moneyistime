import type { Component } from "solid-js";
import { createSignal, createMemo } from "solid-js";
import Slider from "./components/Slider";

const App: Component = () => {
  const [workingHoursDay, setWorkingHoursDay] = createSignal(6.5);
  const [daysPerWeek, setDaysPerWeek] = createSignal(5);
  const [overtimeHours, setOvertimeHours] = createSignal(5);

  const weeklyHours = createMemo(() => workingHoursDay() * daysPerWeek());

  return (
    <>
      <h1>Hello world!!!!</h1>
      <h3>Work time</h3>
      <Slider
        id="working_hours_day"
        value={workingHoursDay}
        setValue={setWorkingHoursDay}
        min={0}
        max={24}
        step={0.25}
        labelTemplate="{value} hours/day"
      />
      <Slider
        id="days_per_week"
        value={daysPerWeek}
        setValue={setDaysPerWeek}
        min={0}
        max={7}
        step={1}
        labelTemplate="{value} days/week"
      />
      <Slider
        id="working_hours_week"
        value={weeklyHours}
        min={0}
        max={168}
        step={0.25}
        labelTemplate="{value} hours/week"
        disabled
      />
      <Slider
        id="overtime_hours_week"
        value={overtimeHours}
        setValue={setOvertimeHours}
        min={0}
        max={42}
        step={0.25}
        labelTemplate="{value} overtime hours/week"
      />
    </>
  );
};

export default App;
