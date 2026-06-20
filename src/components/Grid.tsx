import type { Component, JSX } from "solid-js";
import { For, children } from "solid-js";

interface GridProps {
  columns: number;
  wrap?: boolean;
  children: JSX.Element;
}

const Grid: Component<GridProps> = (props): JSX.Element => {
  const resolved = children(() => props.children);
  const tag = () => props.tag || "div";
  const wrap = () => props.wrap !== false;

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
      {(row) => {
        return (
          <tag class="grid">
            <For each={row}>
              {(child) => (wrap() ? <div>{child}</div> : child)}
            </For>
          </tag>
        );
      }}
    </For>
  );
};

export default Grid;
