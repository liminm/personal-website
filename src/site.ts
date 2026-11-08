// Central site metadata. LinkedIn and email stay null until Limin provides
// them; the footer renders only links that are set, so there are never dead
// placeholder links in the UI.
export const site = {
  name: 'Limin Malek',
  role: 'Software Engineer',
  location: 'Berlin, Germany',
  description:
    'Software engineer working on backend systems, optimization, and production software. Interested in distributed systems, AI infrastructure, agent architectures, and performance engineering.',
  url: 'https://liminm.eu',
  links: {
    github: 'https://github.com/liminm',
    linkedin: null as string | null,
    email: null as string | null,
  },
  nav: [
    { href: '/', label: 'Home' },
    { href: '/work', label: 'Work' },
    { href: '/notes', label: 'Notes' },
    { href: '/about', label: 'About' },
  ],
};
