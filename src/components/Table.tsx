import type { Component } from "solid-js";
import { For } from "solid-js";

type ColumnAlignment = "left" | "center" | "right";

interface ColumnFormat {
  format?: (value: number) => string;
}

interface TableProps {
  data: Array<Array<string | (() => number)>>;
  columnFormat?: Array<ColumnFormat | undefined>;
  columnAlign?: Array<ColumnAlignment | undefined>;
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

  const getCellStyle = (colIndex: number) => {
    const align = props.columnAlign?.[colIndex];
    return align ? { "text-align": align } : {};
  };

  return (
    <table class={`${props.class ?? ""}`}>
      <thead>
        <tr>
          <For each={props.data[0]}>
            {(cell, cellIndex) => (
              <th scope="col" style={getCellStyle(cellIndex())}>
                {renderValue(cell, cellIndex())}
              </th>
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
                    <th scope="row" style={getCellStyle(cellIndex())}>
                      {renderValue(cell, cellIndex())}
                    </th>
                  ) : (
                    <td style={getCellStyle(cellIndex())}>
                      {renderValue(cell, cellIndex())}
                    </td>
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
