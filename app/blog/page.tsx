import Link from "next/link";
import type { Metadata } from "next";
import { getAllBlogs } from "../lib/blogs";
import SearchableList from "../components/SearchableList";
import BlogContent from "./BlogContent";

export const metadata: Metadata = {
  title: "Blog - Atharva Verma",
  description: "Writing about code, ideas, and learning",
};

const BLOGS = getAllBlogs();

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-black">
      <div className="mx-auto max-w-4xl px-6 py-24">
        <BlogContent blogs={BLOGS} />
      </div>
    </main>
  );
}
