import type { MDXComponents } from "mdx/types";
import { MDXImage } from "@/app/components/MDXImage";

const merge = (...values: Array<string | undefined>) =>
  values.filter(Boolean).join(" ");

const baseText = "text-base leading-8 text-zinc-700 dark:text-zinc-300";

const components: MDXComponents = {
  h1: ({ className, ...props }) => (
    <h1
      {...props}
      className={merge(
        "mt-12 text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 first:mt-0",
        className,
      )}
    />
  ),
  h2: ({ className, ...props }) => (
    <h2
      {...props}
      className={merge(
        "mt-10 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100",
        className,
      )}
    />
  ),
  h3: ({ className, ...props }) => (
    <h3
      {...props}
      className={merge(
        "mt-8 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100",
        className,
      )}
    />
  ),
  h4: ({ className, ...props }) => (
    <h4
      {...props}
      className={merge(
        "mt-6 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100",
        className,
      )}
    />
  ),
  p: ({ className, ...props }) => (
    <p {...props} className={merge(baseText, "mt-6", className)} />
  ),
  ul: ({ className, ...props }) => (
    <ul
      {...props}
      className={merge(
        baseText,
        "mt-6 list-disc space-y-2 pl-6 marker:text-zinc-400 dark:marker:text-zinc-500",
        className,
      )}
    />
  ),
  ol: ({ className, ...props }) => (
    <ol
      {...props}
      className={merge(
        baseText,
        "mt-6 list-decimal space-y-2 pl-6 marker:text-zinc-400 dark:marker:text-zinc-500",
        className,
      )}
    />
  ),
  li: ({ className, ...props }) => (
    <li
      {...props}
      className={merge("leading-relaxed text-zinc-700 dark:text-zinc-300", className)}
    />
  ),
  blockquote: ({ className, ...props }) => (
    <blockquote
      {...props}
      className={merge(
        "mt-6 border-l-4 border-zinc-200 pl-6 italic text-zinc-600 dark:border-zinc-700 dark:text-zinc-300",
        className,
      )}
    />
  ),
  code: ({ className, ...props }) => (
    <code
      {...props}
      className={merge(
        "rounded bg-zinc-100 px-1.5 py-0.5 text-sm font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100",
        className,
      )}
    />
  ),
  pre: ({ className, ...props }) => (
    <pre
      {...props}
      className={merge(
        "mt-6 overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm leading-7 text-zinc-100 shadow-lg",
        className,
      )}
    />
  ),
  hr: ({ className, ...props }) => (
    <hr
      {...props}
      className={merge(
        "my-12 h-px border-0 bg-zinc-200 dark:bg-zinc-800",
        className,
      )}
    />
  ),
  a: ({ className, ...props }) => (
    <a
      {...props}
      className={merge(
        "font-medium text-blue-600 underline decoration-2 underline-offset-4 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300",
        className,
      )}
    />
  ),
  img: (props) => <div className="my-6"><MDXImage {...props} /></div>,
  video: ({ className, ...props }) => (
    <video
      {...props}
      className={merge("w-full h-auto rounded-lg my-6", className)}
    />
  ),
};

export function useMDXComponents(
  override: MDXComponents = {},
): MDXComponents {
  return {
    ...components,
    ...override,
  };
}