# Portfolio

Personal portfolio built with Astro, TypeScript, MDX, plain CSS, and Vite+.
It ships as a static site and has no React runtime or framework integration.

## Stack

- **Framework**: Astro
- **Toolchain**: Vite+ (`vp`)
- **Styling**: Plain CSS
- **Content**: MDX for blog posts and project writeups
- **Fonts**: Arial + Geist Mono
- **Deployment**: Cloudflare Pages (static output)

## Development

```bash
bun install
bun run dev
bun run build
bun run preview
bun run lint
bun run typecheck
```

The local Vite+ CLI is installed with the project. Use `vp run dev`,
`vp run build`, `vp lint`, and `vp outdated` when the global CLI is installed;
otherwise, run the local outdated check with `bun run vp outdated`.

Set `PUBLIC_GOATCOUNTER_CODE` to enable GoatCounter analytics. Local image assets
are optimized into responsive WebP variants by Astro's built-in image service.
Astro prerenders the home, content index, project, blog, contact, miscellaneous,
and not-found pages to `dist/`, ready to deploy as the Cloudflare Pages output
directory.

Static pages are in `app/pages/`; page layouts and shared components are in
`app/layouts/` and `app/components/`. Blog and project writeups live in
`app/content/`; each writeup's validated frontmatter drives its listing and
route metadata through Astro content collections.

Component and page styles, including responsive rules, live in their `.astro`
files. Only site-wide defaults and shared page layout belong in
`app/globals.css` and `app/styles/site.css`; shared image utilities belong to
`ResponsiveImage.astro`.

## License

MIT
