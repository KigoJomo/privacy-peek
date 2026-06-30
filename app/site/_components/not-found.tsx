import Link from "next/link";
import { HomeIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <>
      <section className="min-h-[70vh] flex flex-col items-center justify-center gap-6 text-center">
        <div className="size-24 rounded-full bg-accent flex items-center justify-center mb-2">
          <span className="text-4xl font-bold text-muted-foreground">?</span>
        </div>

        <h1 className="capitalize">Site not found</h1>

        <p className="text-muted-foreground max-w-md">
          The site you&apos;re looking for doesn&apos;t exist or hasn&apos;t
          been analyzed yet.
        </p>

        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "inline-flex items-center gap-2",
          )}
        >
          <HomeIcon className="size-4" />
          Back to home
        </Link>
      </section>

      <div className="fixed -top-24 -left-24 -z-10 w-128 aspect-square rounded-full bg-accent/70 blur-3xl animate-blob-pulse" />
      <div
        className="fixed -bottom-24 -right-24 -z-10 w-128 aspect-square rounded-full bg-accent/70 blur-3xl animate-blob-pulse"
        style={{ animationDelay: "-4s" }}
      />
    </>
  );
}
