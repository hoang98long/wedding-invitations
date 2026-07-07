# Hoàng Long & Hà Thanh Wedding

Premium modern wedding invitation website built with Next.js 15 App Router, TypeScript, TailwindCSS, Framer Motion, shadcn/ui-style components, Lucide React, and React Hook Form.

## Development

```bash
npm install
npm run dev
```

Open the local URL printed by Next.js.

## Production Build

```bash
npm run build
npm run start
```

## Deploy To Vercel

1. Push the repository to GitHub, GitLab, or Bitbucket.
2. Import the project in Vercel.
3. Use the default framework preset: Next.js.
4. Build command: `npm run build`.
5. Output directory: `.next`.
6. Deploy.

## Notes

- RSVP responses are stored only in local React state for the current browser session.
- Images are optimized through `next/image` and remote Unsplash assets are allowlisted in `next.config.ts`.
- Google Maps is embedded lazily for `Phòng khám đa khoa Đông Hải, Tân Kỳ, Hải Phòng`.
