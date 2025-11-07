export default function ProjectsContentLoading() {
  return (
    <>
      <header className="mb-16">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Projects</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">
          A collection of things I have built.
        </p>
      </header>
      <div className="animate-pulse">
        <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded-md w-full mb-12"></div>
        <div className="space-y-8">
          <div className="h-24 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
          <div className="h-24 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
          <div className="h-24 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
        </div>
      </div>
    </>
  );
}
