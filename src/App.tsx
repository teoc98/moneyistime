import type { Component } from "solid-js";
import { createSignal, createEffect, For, onMount } from "solid-js";
import Slider from "./components/Slider";
import NumberInput from "./components/NumberInput";
import Grid from "./components/Grid";
import Table from "./components/Table";

const serializeToHash = (values: Record<string, number>) => {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) {
    params.set(key, String(value));
  }
  return params.toString();
};

const parseFromHash = (): Record<string, number> => {
  const hash = window.location.hash.slice(1);
  const params = new URLSearchParams(hash);
  const result: Record<string, number> = {};
  for (const [key, value] of params) {
    const num = Number(value);
    if (!isNaN(num)) {
      result[key] = num;
    }
  }
  return result;
};

const App: Component = () => {
  const currency = "EUR"; // TODO dropdrown
  const locale = undefined;
  const timeDecimalDigits = 2;

  const getCurrencySymbol = (fmt) => {
    const parts = fmt.formatToParts(0);
    const symbol = parts.find((p) => p.type === "currency")?.value;
    return symbol;
  };

  const timeFormatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: timeDecimalDigits,
    maximumFractionDigits: timeDecimalDigits,
  });
  const hourFormatter = new Intl.NumberFormat(locale, {
    style: "unit",
    unit: "hour",
    unitDisplay: "short", // "short", "narrow", or "long"
  });
  const currencyFormatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  });
  const currencyFormatterWithCode = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    currencyDisplay: "code",
  });
  const currencyFormatterWithNoSymbol = {
    format(number: number) {
      return currencyFormatterWithCode
        .format(number)
        .replaceAll(new RegExp(currency, "g"), "");
    },
  };
  const currencySymbol = getCurrencySymbol(currencyFormatter);

  const [workingHoursPerDay, setWorkingHoursPerDay] = createSignal(8);
  const [workingDaysPerWeek, setWorkingDaysPerWeek] = createSignal(5);
  const [overtimeHoursPerWeek, setOvertimeHoursPerWeek] = createSignal(5);
  const [daysOffPerYear, setDaysOffPerYear] = createSignal(25);
  const [timeOffPerYear, setTimeOffPerYear] = createSignal(0);
  const [festivitiesPerYear, setFestivitiesPerYear] = createSignal(12);

  const [yearlySalary, setYearlySalary] = createSignal(42000);
  const [monthsPerYear, setMonthsPerYear] = createSignal(12);
  const [yearlyBonus, setYearlyBonus] = createSignal(0);
  const [overtimePayPerHour, setOvertimePayPerHour] = createSignal(0);

  const signals: Record<
    string,
    [() => number, (value: number | ((prev: number) => number)) => void]
  > = {
    workingHoursPerDay: [workingHoursPerDay, setWorkingHoursPerDay],
    workingDaysPerWeek: [workingDaysPerWeek, setWorkingDaysPerWeek],
    overtimeHoursPerWeek: [overtimeHoursPerWeek, setOvertimeHoursPerWeek],
    daysOffPerYear: [daysOffPerYear, setDaysOffPerYear],
    timeOffPerYear: [timeOffPerYear, setTimeOffPerYear],
    festivitiesPerYear: [festivitiesPerYear, setFestivitiesPerYear],
    yearlySalary: [yearlySalary, setYearlySalary],
    monthsPerYear: [monthsPerYear, setMonthsPerYear],
    yearlyBonus: [yearlyBonus, setYearlyBonus],
    overtimePayPerHour: [overtimePayPerHour, setOvertimePayPerHour],
  };

  const urlParams = parseFromHash();
  for (const key in signals) {
    const value = urlParams[key as keyof typeof urlParams];
    if (value !== null && value !== undefined) signals[key][1](value);
  }

  const updateHash = () => {
    const values: Record<string, number> = {};
    for (const key in signals) {
      values[key] = signals[key][0]();
    }
    window.location.hash = serializeToHash(values);
  };

  for (const key in signals) {
    createEffect(() => {
      signals[key][0]();
      updateHash();
    });
  }

  const monthlySalary = () => yearlySalary() / monthsPerYear();

  const setMonthlySalary = (value: number | ((prev: number) => number)) => {
    const newValue =
      typeof value === "function" ? value(monthlySalary()) : value;
    setYearlySalary(newValue * monthsPerYear());
    return newValue;
  };

  const weeklyHours = () => workingHoursPerDay() * workingDaysPerWeek();

  const daysPerYear = 365.25;
  const daysPerWeek = 7;

  const workingDaysPerYear = () =>
    ((daysPerYear - festivitiesPerYear()) * workingDaysPerWeek()) / daysPerWeek;
  const actualWorkingDaysPerYear = () =>
    workingDaysPerYear() - daysOffPerYear();
  const workingHoursPerYear = () =>
    actualWorkingDaysPerYear() * workingHoursPerDay() - timeOffPerYear();
  const overtimeHoursPerYear = () =>
    (actualWorkingDaysPerYear() / workingDaysPerWeek()) *
    overtimeHoursPerWeek();
  const totalWorkingHoursPerYear = () =>
    workingHoursPerYear() + overtimeHoursPerYear();

  const yearlyOvertimeIncome = () =>
    overtimeHoursPerYear() * overtimePayPerHour();
  const totalYearlyIncome = () =>
    yearlySalary() + yearlyBonus() + yearlyOvertimeIncome();

  const actualIncomePerHour = () =>
    totalYearlyIncome() / totalWorkingHoursPerYear();

  const timeMetrics = [
    ["", ""],
    ["days", () => daysPerYear],
    ["working days", workingDaysPerYear],
    ["actual working days", actualWorkingDaysPerYear],
    ["working hours", workingHoursPerYear],
    ["overtime working hours", overtimeHoursPerYear],
    ["total working hours", totalWorkingHoursPerYear],
  ];
  const detailedBreakdown = [
    ["", "hours/year", `${currencySymbol}/year`, `${currencySymbol}/hour`],
    [
      "base",
      workingHoursPerYear,
      yearlySalary,
      () => yearlySalary() / workingHoursPerYear(),
    ],
    ["bonus", "-", yearlyBonus, "-"],
    [
      "overtime",
      overtimeHoursPerYear,
      yearlyOvertimeIncome,
      overtimePayPerHour,
    ],
    ["total", totalWorkingHoursPerYear, totalYearlyIncome, actualIncomePerHour],
  ];

  return (
    <>
      <hgroup>
        <h1>Money is time 💸 = ⏳</h1>
        <p>Find out how much time your money is worth</p>
      </hgroup>
      <article>
        <div>
          <h3>Net income 💵</h3>
          <Grid columns={3}>
            <NumberInput
              id="yearly_salary"
              value={yearlySalary}
              setValue={setYearlySalary}
              labelTemplate={`salary of {value} ${currencySymbol}/year`}
              placeholder="Yearly salary"
              formatter={currencyFormatterWithNoSymbol}
            />
            <NumberInput
              id="monthly_salary"
              value={monthlySalary}
              setValue={setMonthlySalary}
              labelTemplate={`salary of {value} ${currencySymbol}/month`}
              placeholder="Monthly salary"
              formatter={currencyFormatterWithNoSymbol}
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
              labelTemplate={`bonus of {value} ${currencySymbol}/year`}
              placeholder="Yearly bonus"
              formatter={currencyFormatterWithNoSymbol}
            />
            <NumberInput
              id="overtime_pay_hour"
              value={overtimePayPerHour}
              setValue={setOvertimePayPerHour}
              labelTemplate={`overtime paid {value} ${currencySymbol}/hour`}
              placeholder="Overtime pay/hour"
              formatter={currencyFormatterWithNoSymbol}
            />
          </Grid>
        </div>
        <div>
          <h3>Work time 🕒</h3>
          <Grid columns={2}>
            <Slider
              id="working_hours_day"
              value={workingHoursPerDay}
              setValue={setWorkingHoursPerDay}
              min={0}
              max={24}
              step={0.25}
              labelTemplate="{value} hours/day"
              formatter={timeFormatter}
            />
            <Slider
              id="days_per_week"
              value={workingDaysPerWeek}
              setValue={setWorkingDaysPerWeek}
              min={1}
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
              formatter={timeFormatter}
            />
            <Slider
              id="overtime_hours_week"
              value={overtimeHoursPerWeek}
              setValue={setOvertimeHoursPerWeek}
              min={0}
              max={42}
              step={0.25}
              labelTemplate="{value} overtime hours/week"
              formatter={timeFormatter}
            />
            <NumberInput
              id="days_off"
              value={daysOffPerYear}
              setValue={setDaysOffPerYear}
              labelTemplate="{value} days off/year"
              placeholder="Days off"
            />
            <NumberInput
              id="time_off"
              value={timeOffPerYear}
              setValue={setTimeOffPerYear}
              labelTemplate="{value} hours off/year"
              placeholder="Hours off"
            />
            <NumberInput
              id="festivities_per_year"
              value={festivitiesPerYear}
              setValue={setFestivitiesPerYear}
              labelTemplate="{value} festive days/year"
              placeholder="Festivities"
            />
          </Grid>
        </div>
      </article>

      <article>
        <div>
          <h3>Conversion 💱</h3>
          <div
            id="conversion"
            style={{ "text-align": "center", padding: "1rem 0 2rem 0" }}
          >
            <span style={{ "font-size": "2rem", "font-weight": "bold" }}>
              {hourFormatter.format(1)} ={" "}
              {currencyFormatter.format(actualIncomePerHour())}
            </span>
          </div>
        </div>
        <div>
          <h3>Time metrics 🕰</h3>
          <div class="overflow-auto">
            <Table
              data={timeMetrics}
              columnFormat={[undefined, timeFormatter]}
              columnAlign={["left", "right"]}
              class="striped"
            />
          </div>
        </div>
        <div>
          <h3>Detailed breakdown 🧩</h3>
          <div class="overflow-auto">
            <Table
              data={detailedBreakdown}
              columnFormat={[
                undefined,
                timeFormatter,
                currencyFormatterWithNoSymbol,
                currencyFormatterWithNoSymbol,
              ]}
              columnAlign={["left", "right", "right", "right"]}
              class="striped"
            />
          </div>
        </div>
      </article>
    </>
  );
};

export default App;
