import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { RequireOnly, SiteDetails } from '@/convex/lib';
import { cn, formatRelativeTime } from '@/lib/utils';
import Link from 'next/link';
import { getSampleSites } from '../_mocks/sampleSites';
import ScoreVisualizer from '@/components/ui/score-visualizer';

export default function RecentlyAnalyzed() {
  return (
    <section className={cn('flex flex-col gap-2')}>
      <h4>Recently Analyzed</h4>

      <div
        className={cn(
          'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8'
        )}>
        {getSampleSites(6).map((site) => (
          <SiteCard key={site._id} site_details={site} />
        ))}
      </div>
    </section>
  );
}

export function SiteCard({
  site_details,
}: {
  site_details: RequireOnly<
    SiteDetails,
    | '_id'
    | 'normalized_base_url'
    | 'site_name'
    | 'overall_score'
    | 'reasoning'
    | 'last_analyzed'
    | 'category_scores'
  >;
}) {
  const {
    site_name,
    normalized_base_url,
    overall_score,
    last_analyzed,
    category_scores,
  } = site_details;
  return (
    <Card>
      <CardHeader className='border-b'>
        <CardTitle>
          <Link href={normalized_base_url} target="_blank">
            <h4>{site_name}</h4>
          </Link>
        </CardTitle>
        <CardDescription>
          Analyzed {formatRelativeTime(last_analyzed)}
        </CardDescription>
        <CardAction className='flex items-center gap-2'>
          <span className="text-sm">Overall Score /100</span>
          <ScoreVisualizer
            value={(overall_score ?? 0) / 100}
            displayNumber={overall_score}
            className="md:mr-1"
          />
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        <span className="-mt-2 text-center text-muted-foreground">Category Scores (/10)</span>
        {category_scores.map((catg, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-4"
            aria-label={`${catg.category_name} score ${catg.category_score} out of 10`}>
            <p className="truncate !text-base">{catg.category_name}</p>

            <ScoreVisualizer
              value={(catg.category_score ?? 0) / 10}
              size={32}
              displayNumber={catg.category_score}
            />
          </div>
        ))}
      </CardContent>

      <CardFooter></CardFooter>
    </Card>
  );
}
