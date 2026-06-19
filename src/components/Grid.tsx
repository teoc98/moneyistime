import type { Component, JSX } from "solid-js";
import { For, children } from "solid-js";

interface GridProps {
  columns: number;
  children: JSX.Element;
}

const Grid: Component<GridProps> = (props): JSX.Element => {
  const resolved = children(() => props.children);

  const rows = () => {
    const arr = resolved.toArray();
    const result: JSX.Element[][] = [];
    for (let i = 0; i < arr.length; i += props.columns) {
      result.push(arr.slice(i, i + props.columns));
    }
    return result;
  };

  return (
    <For each={rows()}>
      {(row) => (
        <div class="grid">
          <For each={row}>{(child) => <div>{child}</div>}</For>
        </div>
      )}
    </For>
  );
};

export default Grid;
