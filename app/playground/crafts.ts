export type Craft = {
  slug: string;
  title: string;
  date?: string;
  aspect: string; // card aspect for the grid, for example "4 / 3"
  background?: string; // stage background, defaults to a dark surface
};

// Placeholders. Swap these for real crafts when they are ready.
export const crafts: Craft[] = [
  { slug: "placeholder-01", title: "Placeholder 01", aspect: "4 / 3" },
  { slug: "placeholder-02", title: "Placeholder 02", aspect: "3 / 4" },
  { slug: "placeholder-03", title: "Placeholder 03", aspect: "1 / 1" },
  { slug: "placeholder-04", title: "Placeholder 04", aspect: "16 / 9" },
  { slug: "placeholder-05", title: "Placeholder 05", aspect: "4 / 3" },
  { slug: "placeholder-06", title: "Placeholder 06", aspect: "3 / 4" },
];

export const getCraftIndex = (slug: string) =>
  crafts.findIndex((c) => c.slug === slug);
