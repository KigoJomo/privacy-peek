import RecentSites from './_components/recent-sites';
import SearchComponent from './_components/SearchComponent';

export default function Home() {
  return (
    <>
      <section className="flex flex-col items-center gap-16">
        <div className="w-full flex flex-col items-center gap-2 text-center">
          <h1 className="capitalize leading-none">your privacy matters</h1>
          <p className="tagline">
            Get clear insights into how websites handle your personal data
          </p>
        </div>

        <SearchComponent />
      </section>

      <RecentSites />

      <div className='fixed -top-24 -left-24 -z-10 w-128 aspect-square rounded-full bg-accent/70 blur-3xl' />

      <div className='fixed -bottom-24 -right-24 -z-10 w-128 aspect-square rounded-full bg-accent/70 blur-3xl' />
    </>
  );
}
