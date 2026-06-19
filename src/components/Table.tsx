import type { Component } from "solid-js";
import { For } from "solid-js";

interface TableProps {
  data: Array<Array<string | (() => number)>>;
  class?: string;
}

const Table: Component<TableProps> = (props) => {
  const renderValue = (value: string | (() => number)) => {
    return typeof value === "function" ? value() : value;
  };

  return (
    <table class={`${props.class ?? ""}`}>
      <thead>
        <tr>
          <For each={props.data[0]}>
            {(cell) => <th scope="col">{renderValue(cell)}</th>}
          </For>
        </tr>
      </thead>
      <tbody>
        <For each={props.data.slice(1)}>
          {(row, index) => (
            <tr>
              <For each={row}>
                {(cell, cellIndex) =>
                  cellIndex() === 0 ? (
                    <th scope="row">{renderValue(cell)}</th>
                  ) : (
                    <td>{renderValue(cell)}</td>
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
