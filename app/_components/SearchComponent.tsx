'use client';

import { useState } from 'react';
import { Searchbar } from './Searchbar';
import { SearchResult as ISearchResult } from '@/app/_components/search_action';
import SearchResult from './SearchResult';
import SearchInput from './SearchInput';

export default function SearchComponent() {
  const [searchResult, setSearchResult] = useState<ISearchResult | null>(null);

  const handleSearchResult = (result: ISearchResult) => {
    setSearchResult(result);
  };

  return (
    <>
      <SearchInput />
      {/* <Searchbar onSearchResult={handleSearchResult} /> */}
      <SearchResult searchResult={searchResult} />
    </>
  );
}
