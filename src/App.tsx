import type { Component } from "solid-js";
import { createSignal, createMemo } from "solid-js";
import Slider from "./components/Slider";
import NumberInput from "./components/NumberInput";
import Grid from "./components/Grid";

const App: Component = () => {
  const currency = "$";

  const [workingHoursDay, setWorkingHoursDay] = createSignal(8);
  const [daysPerWeek, setDaysPerWeek] = createSignal(5);
  const [overtimeHours, setOvertimeHours] = createSignal(5);
  const [daysOff, setDaysOff] = createSignal(25);
  const [timeOff, setTimeOff] = createSignal(0);

  const [yearlySalary, setYearlySalary] = createSignal(42000);
  const [monthsPerYear, setMonthsPerYear] = createSignal(12);
  const [yearlyBonus, setYearlyBonus] = createSignal(0);
  const [overtimePayHour, setOvertimePayHour] = createSignal(0);

  const monthlySalary = createMemo(() => yearlySalary() / monthsPerYear());

  const setMonthlySalary = (value: number | ((prev: number) => number)) => {
    const newValue =
      typeof value === "function" ? value(monthlySalary()) : value;
    setYearlySalary(newValue * monthsPerYear());
    return newValue;
  };

  const weeklyHours = createMemo(() => workingHoursDay() * daysPerWeek());

  return (
    <>
      <h1>Money is time 💸 = ⏳</h1>
      <article>
        <h3>Net income</h3>
        <Grid columns={3}>
          <NumberInput
            id="yearly_salary"
            value={yearlySalary}
            setValue={setYearlySalary}
            labelTemplate={`salary of {value} ${currency}/year`}
            placeholder="Yearly salary"
          />
          <NumberInput
            id="monthly_salary"
            value={monthlySalary}
            setValue={setMonthlySalary}
            labelTemplate={`salary of {value} ${currency}/month`}
            placeholder="Monthly salary"
          />
          <NumberInput
            id="months_per_year"
            value={monthsPerYear}
            setValue={setMonthsPerYear}
            labelTemplate="for {value} months/year"
            placeholder="Months per year"
          />
          <NumberInput
            id="yearly_bonus"
            value={yearlyBonus}
            setValue={setYearlyBonus}
            labelTemplate={`bonus of {value} ${currency}/year`}
            placeholder="Yearly bonus"
          />
          <NumberInput
            id="overtime_pay_hour"
            value={overtimePayHour}
            setValue={setOvertimePayHour}
            labelTemplate={`overtime paid {value} ${currency}/hour`}
            placeholder="Overtime pay/hour"
          />
        </Grid>
        <h3>Work time</h3>
        <Grid columns={2}>
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
          <NumberInput
            id="days_off"
            value={daysOff}
            setValue={setDaysOff}
            labelTemplate="{value} days off"
            placeholder="Days off"
          />
          <NumberInput
            id="time_off"
            value={timeOff}
            setValue={setTimeOff}
            labelTemplate="{value} hours off"
            placeholder="Hours off"
          />
        </Grid>
      </article>
    </>
  );
};

export default App;
