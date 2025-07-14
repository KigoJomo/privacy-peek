import CircularProgress from '@/components/global/CircularProgress';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { api } from '@/convex/_generated/api';
import { cn } from '@/lib/utils';
import { formatRelativeTime } from '@/lib/utils/utils';
import { fetchQuery } from 'convex/nextjs';
import Link from 'next/link';

export async function RecentlyAnalyzed() {
  const recentSites = await fetchQuery(api.websites.getRecentWebsites, {
    limit: 6,
  });

  return (
    <div className="w-full">
      <p className="!text-sm">Recently Analyzed</p>

      {recentSites && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          {recentSites.map((site, index) => (
            <Card key={`${site}-${index}`}>
              <CardHeader>
                <CardTitle>{site.site_name}</CardTitle>
                <CardDescription className="text-muted-foreground text-xs">
                  {formatRelativeTime(site.last_analyzed)}
                </CardDescription>

                <CardAction className="flex items-center gap-2">
                  <span className="text-muted-foreground text-sm">
                    Overall Score <span className="text-xs">/100</span>
                  </span>
                  <CircularProgress
                    value={site.overall_score / 100}
                    displayNumber={site.overall_score}
                  />
                </CardAction>
              </CardHeader>

              <CardContent className="flex flex-col gap-2">
                <span className="text-muted-foreground text-xs mb-2">
                  Category Scores (/10)
                </span>
                {Object.entries(site.category_scores).map(
                  ([key, value], index) => {
                    const score = value.score / 10;
                    const red = Math.round(150 * (1 - score));
                    const green = Math.round(150 * score);
                    const borderColor = `rgb(${red}, ${green}, 0)`;

                    return (
                      <div
                        key={index}
                        className="w-full flex items-center gap-2">
                        <span>{key}</span>
                        <span
                          className={cn(
                            'px-2 border-4 aspect-square rounded-full',
                            'flex items-center justify-center ml-auto'
                          )}
                          style={{ borderColor }}>
                          {value.score}
                        </span>
                      </div>
                    );
                  }
                )}
              </CardContent>

              <CardFooter>
                <Link
                  href={site.normalized_url}
                  className="text-primary hover:underline"
                  target="_blank">
                  <span className="text-xs">{site.normalized_url}</span>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {!recentSites && (
        <div className="">
          <p className="">No recently analyzed websites</p>
        </div>
      )}
    </div>
  );
}
