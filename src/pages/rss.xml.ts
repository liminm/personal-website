import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { site } from '../site';
import type { NoteEntry } from '../content-types';

export async function GET(context: { site: URL }) {
  const notes = ((await getCollection('notes')) as unknown as NoteEntry[])
    .filter((n) => !n.data.draft)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  return rss({
    title: `${site.name} — Notes`,
    description: 'Technical notebook: investigations, experiments, and research notes.',
    site: context.site,
    items: notes.map((n) => ({
      title: n.data.title,
      description: n.data.description,
      pubDate: n.data.date,
      link: `/notes/${n.id}/`,
    })),
  });
}
