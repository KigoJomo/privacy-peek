// import { RecentlyAnalyzed } from './_components/RecentlyAnalyzed';
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

        {/* <RecentlyAnalyzed /> */}
      </section>
    </>
  );
}
