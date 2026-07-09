"use client";

import { useColumnCount } from "./useColumnCount";

/**
 * Full-bleed masonry. Items are distributed round-robin by index (index modulo
 * column count), so the order reads newest first, left to right across the row,
 * while each column stacks and grows independently.
 */
export function MasonryGrid<T>({
  items,
  renderItem,
}: {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
}) {
  const cols = useColumnCount();
  const columns: T[][] = Array.from({ length: cols }, () => []);
  items.forEach((item, i) => columns[i % cols].push(item));

  return (
    <div className="flex w-full gap-3 px-4 md:px-6">
      {columns.map((column, ci) => (
        <div key={ci} className="flex flex-1 flex-col gap-3">
          {column.map((item, i) => renderItem(item, ci + i * cols))}
        </div>
      ))}
    </div>
  );
}
