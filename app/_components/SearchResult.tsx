import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SearchResult as ISearchResult } from '@/app/_components/search_action';
import CircularProgress from '@/components/global/CircularProgress';

export default function SearchResult({
  searchResult,
}: {
  searchResult: ISearchResult | null;
}) {
  return searchResult === null ? (
    <></>
  ) : (
    <Card className="mt-4 max-w-full w-full">
      <CardHeader className="gap-4">
        <CardTitle className="">{searchResult.site_name}</CardTitle>

        <CardDescription className="flex items-center gap-2">
          <CircularProgress
            value={searchResult.overall_score / 100}
            displayNumber={searchResult.overall_score}
          />
          <span className="text-muted-foreground text-sm">
            Overall Score <span className="text-xs">/100</span>
          </span>
        </CardDescription>
      </CardHeader>

      <CardContent></CardContent>

      <CardFooter></CardFooter>
    </Card>
  );
}
