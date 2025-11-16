import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getBlog, BLOGS } from "../../lib/blogs";
import { contentMap } from "../../content/blogs/content";
import { BlogInfoPanel } from "../../components/InfoPanel";
import HeroImage from "../../components/HeroImage";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = getBlog(slug);
  if (!blog) {
    return {
      title: "Post",
      description: "Post not found",
    };
  }

  return {
    title: `${blog.title} — Blog • Atharva Verma`,
    description: blog.description,
  };
}

export function generateStaticParams() {
  return BLOGS.map((blog) => ({
    slug: blog.slug,
  }));
}

export const dynamicParams = false;

export default async function BlogPage({ params }: Props) {
  const { slug } = await params;
  const blog = getBlog(slug);

  if (!blog) {
    notFound();
  }

  const Content = contentMap[slug as keyof typeof contentMap];

  if (!Content) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white dark:bg-black text-zinc-800 dark:text-zinc-200">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <header className="mb-12">
          <Link
            href="/blogs"
            className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
          >
            ← Back to blogs
          </Link>
          <h1 className="mt-6 text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {blog.title}
          </h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-12">
          {/* Main Content */}
          <div className="md:col-span-2">
            {blog.heroImage && (
              <HeroImage
                src={blog.heroImage}
                alt={blog.title}
              />
            )}
            <BlogInfoPanel blog={blog} variant="mobile" />
            <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-semibold prose-headings:text-zinc-900 dark:prose-headings:text-zinc-100">
              <Content />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="md:col-span-1 mt-12 md:mt-0 hidden md:block">
            <BlogInfoPanel blog={blog} className="sticky top-24" />
          </aside>
        </div>
      </div>
    </main>
  );
}
