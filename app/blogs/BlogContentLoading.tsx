export default function BlogContentLoading() {
  return (
    <>
      <header className="mb-16">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Writing</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">
          Thoughts on software, technology, and things I am learning.
        </p>
      </header>
      <div className="animate-pulse">
        <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded-md w-full mb-12"></div>
        <div className="space-y-8">
          <div className="h-20 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
          <div className="h-20 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
          <div className="h-20 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
        </div>
      </div>
    </>
  );
}
