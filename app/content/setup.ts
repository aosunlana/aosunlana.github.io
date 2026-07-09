export type Gear = {
  name: string;
  note: string; // one short line: what it is or why you use it
  url?: string; // optional link
  image?: string; // optional small photo or logo in /public/setup
};

// Real gear only. While this is empty the Setup section stays hidden, so nothing
// placeholder or fake ever ships. Shape example (not rendered):
// { name: 'MacBook Pro 14"', note: 'My main machine for design and code.' }
export const setup: Gear[] = [];
