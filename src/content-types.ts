// Runtime shapes of content-layer entries. These mirror the zod schemas in
// src/content.config.ts (which Astro validates when building). They exist
// because `astro check` cannot resolve the generated collection registry in
// this setup, while `astro build` validates and renders everything correctly.
export interface WorkEntry {
  id: string;
  data: {
    title: string;
    summary: string;
    period?: string;
    tags: string[];
    draft: boolean;
  };
}

export interface NoteEntry {
  id: string;
  data: {
    title: string;
    description: string;
    date: Date;
    tags: string[];
    draft: boolean;
  };
}

export interface TocHeading {
  depth: number;
  slug: string;
  text: string;
}
