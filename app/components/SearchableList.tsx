import React from "react";
import SearchableListClient from "./SearchableListClient";

/**
 * Server wrapper for the client search component.
 *
 * Reasoning:
 * - The interactive behavior (search/filter UI) must live in a Client Component.
 * - Client Components cannot receive functions from Server Components (Next.js will try to serialize
 *   them and throw at runtime). To avoid that we normalize items on the server into plain serializable
 *   objects and pass only data to the client component.
 *
 * Usage:
 * - Pages (server components) can continue to call this wrapper with accessor functions.
 * - This wrapper will invoke those accessors on the server, produce a serializable shape and render
 *   the client component with only plain data props.
 *
 * Note: The client component file `SearchableListClient.tsx` must exist in the same directory.
 * It receives `items: PlainItem[]` and the other simple props.
 */

/* Accessors are only used on the server side to normalize items. */
export type Accessors<T> = {
  getId: (item: T) => string;
  getTitle: (item: T) => string;
  getDescription?: (item: T) => string | undefined;
  getHref?: (item: T) => string | undefined;
  getDate?: (item: T) => string | undefined;
  getTags?: (item: T) => string[] | undefined;
  getImage?: (item: T) => string | undefined;
};

/* Plain serializable shape passed to the client */
export type PlainItem = {
  id: string;
  title: string;
  description?: string;
  href?: string | null;
  date?: string | null;
  tags: string[];
  // allow extra fields if you want, but keep them serializable
  [key: string]: any;
};

export type ServerSearchableListProps<T> = {
  items: T[];
  accessors: Accessors<T>;
  placeholder?: string;
  syncWithQuery?: boolean;
  className?: string;
};

/**
 * Server-side wrapper component.
 * - Normalizes items using provided accessor functions (safe on the server).
 * - Passes plain serializable items to the Client component.
 */
export default function SearchableList<T>({
  items,
  accessors,
  placeholder = "Search...",
  syncWithQuery = false,
  className,
}: ServerSearchableListProps<T>) {
  const { getId, getTitle, getDescription, getHref, getTags, getDate, getImage } =
    accessors;

  // Normalize to plain serializable items on the server.
  const plainItems: PlainItem[] = items.map((it) => ({
    id: getId(it),
    title: getTitle(it),
    description: getDescription ? (getDescription(it) ?? "") : "",
    href: getHref ? (getHref(it) ?? null) : null,
    date: getDate ? (getDate(it) ?? null) : null,
    tags: getTags ? (getTags(it) ?? []) : [],
    image: getImage ? (getImage(it) ?? null) : null,
  }));

  // Render the client component and pass only serializable props.
  // The client component will handle all interactivity, URL sync, highlighting, etc.
  return (
    <SearchableListClient
      items={plainItems}
      placeholder={placeholder}
      syncWithQuery={syncWithQuery}
      className={className}
    />
  );
}
