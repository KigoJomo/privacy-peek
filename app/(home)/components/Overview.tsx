import Button from '@/lib/components/ui/Button';
import Logo from '@/lib/components/ui/Logo';

const Overview = () => {
  const highlights: { title: string; figure?: string; cta?: string }[] = [
    {
      title: 'Privacy Policies Analyzed',
      figure: '+128',
      cta: 'Best Scoring Companies',
    },
    {
      title: 'Terms of Service Peeked',
      figure: '+140',
      cta: 'View Our Ranking Model'
    },
    {
      title: 'How to join the fight',
    },
  ];

  return (
    <section className="!pt-16 min-h-dvh flex flex-col items-center gap-16 radial-gradient relative overflow-hidden">
      <div className="flex flex-col items-center justify-center gap-1">
        <h1 className="text-center">Your data privacy matters!</h1>
        <p className="text-center">
          Join the fight for healthier data practices today!
        </p>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
        {highlights.map((item, index) => (
          <div
            key={index}
            className="w-full aspect-[3/3.5] border-2 border-foreground-light/20 p-4 rounded-xl bg-background/20 backdrop-blur flex flex-col gap-2">
            <h4 className="text-foreground-light">{item.title}</h4>

            {item.figure && <h2>{item.figure}</h2>}

            {item.cta && (
              <Button variant='outline' className="w-full mt-auto flex items-center gap-2">
                {item.cta}
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="absolute -z-10 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 opacity-5">
        <Logo size={800} />
      </div>
    </section>
  );
};

export default Overview;
