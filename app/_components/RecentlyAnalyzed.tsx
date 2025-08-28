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
import {
  Dialog,
  // DialogClose,
  DialogContent,
  DialogDescription,
  // DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { api } from '@/convex/_generated/api';
import { cn, formatRelativeTime } from '@/lib/utils';
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
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {recentSites.map((site, index) => (
            <Dialog key={`${site}-${index}`}>
              <DialogTrigger>
                <Card className="cursor-pointer">
                  <CardHeader className="text-left">
                    <CardTitle className="">
                      <h4>{site.site_name}</h4>
                    </CardTitle>

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

                  <hr className="-my-2" />

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
              </DialogTrigger>

              <DialogContent className="">
                <DialogHeader>
                  <DialogTitle>{site.site_name}</DialogTitle>
                  <DialogDescription>
                    Detailed analysis of {site.site_name}&apos;s privacy
                    practices.
                  </DialogDescription>
                </DialogHeader>

                <Separator />
              </DialogContent>
            </Dialog>
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
