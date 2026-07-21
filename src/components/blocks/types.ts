export type PageBlock =
  | { type: 'info'; id?: string; heading: string; lines: string[]; note?: string; columns?: boolean }
  | { type: 'feeder-materials'; id?: string }
  | { type: 'auto-flush'; id?: string }
  | { type: 'customization'; id?: string }
  | { type: 'upgrade-path'; id?: string }
  | { type: 'feeding-trolley'; id?: string }
  | { type: 'lighting'; id?: string };
