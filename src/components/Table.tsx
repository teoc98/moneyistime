import type { Component } from "solid-js";
import { For } from "solid-js";

interface ColumnFormat<T> {
  format?: (value: T) => string;
}

interface TableProps<T> {
  data: Array<Array<T>>;
  columnFormat?: Array<ColumnFormat | undefined>;
  class?: string;
}

function extendArray(arr: Array<any>, n: number, value: any = undefined) {
  return arr.length >= n
    ? arr.slice(0, n)
    : arr.concat(Array(n - arr.length).fill(value));
}

const Table: Component<TableProps> = (props) => {
  const renderValue = (value: string | (() => number), colIndex: number) => {
    const raw = typeof value === "function" ? value() : value;
    const config = props.columnFormat?.[colIndex];
    if (config?.format && typeof raw === "number") {
      return config.format(raw);
    }
    return raw;
  };
  const nCols = Math.max(...props.data.map((row) => row.length));

  return (
    <table class={`${props.class ?? ""}`}>
      <thead>
        <tr>
          <For each={props.data[0]}>
            {(cell, cellIndex) => (
              <th scope="col">{renderValue(cell, cellIndex())}</th>
            )}
          </For>
        </tr>
      </thead>
      <tbody>
        <For each={props.data.slice(1)}>
          {(row, index) => (
            <tr>
              <For each={extendArray(row, nCols)}>
                {(cell, cellIndex) =>
                  cellIndex() === 0 ? (
                    <th scope="row">{renderValue(cell, cellIndex())}</th>
                  ) : (
                    <td>{renderValue(cell, cellIndex())}</td>
                  )
                }
              </For>
            </tr>
          )}
        </For>
      </tbody>
    </table>
  );
};

export default Table;
