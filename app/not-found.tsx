import Link from "next/link";

export default function NotFound() {
  return (
    <section className="min-h-[90vh] flex flex-col items-center justify-center gap-12">
      <h1>404</h1>
      <h3>This page could not be found.</h3>
      <Link href="/">Click here to go back to the home page.</Link>
    </section>
  );
}
