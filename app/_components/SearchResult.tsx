import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { SearchResult as ISearchResult } from '@/app/_components/search_action';
import CircularProgress from '@/components/global/CircularProgress';
import { cn } from '@/lib/utils';

export default function SearchResult({
  searchResult,
}: {
  searchResult: ISearchResult | null;
}) {
  return searchResult === null ? (
    <></>
  ) : (
    <Card className="mt-4 max-w-3xl w-full">
      <CardHeader className="gap-4">
        <CardTitle className="flex items-center justify-between">
          <h4>{searchResult.site_name}</h4>
          <span className="font-normal text-sm text-muted-foreground">
            Analyzed {searchResult.last_analyzed}
          </span>
        </CardTitle>

        <hr />

        <CardDescription className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <CircularProgress
              value={searchResult.overall_score / 100}
              displayNumber={searchResult.overall_score}
            />
            <span className="text-muted-foreground text-sm">
              Overall Score (/100)
            </span>
          </div>

          <p
            title={`Why ${searchResult.site_name} received this score.`}
            className="!text-sm">
            {searchResult.reasoning}
          </p>
        </CardDescription>
      </CardHeader>

      <hr />

      <CardContent className="flex flex-col gap-2">
        <span className="text-muted-foreground text-sm">
          Category Scores (/10)
        </span>

        <Accordion type="single" collapsible className="">
          {Object.entries(searchResult.category_scores).map(
            ([key, value], index) => {
              const score = value.score / 10;
              const red = Math.round(150 * (1 - score));
              const green = Math.round(150 * score);
              const borderColor = `rgb(${red}, ${green}, 0)`;
              return (
                <AccordionItem value={key} key={index} className="">
                  <AccordionTrigger className="flex items-center gap-2">
                    <div className="flex items-center gap-4">
                      <span
                        className={cn(
                          'px-2 border-4 aspect-square rounded-full',
                          'flex items-center justify-center'
                        )}
                        style={{ borderColor }}>
                        {value.score}
                      </span>
                      <span>{key}</span>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent>
                    <p
                      title={`Why ${searchResult.site_name} received this score in ${key}.`}
                      className="!text-sm text-muted-foreground ml-4 pl-6 border-l-2">
                      {value.reasoning}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              );
            }
          )}
        </Accordion>
      </CardContent>

      <CardFooter></CardFooter>
    </Card>
  );
}
