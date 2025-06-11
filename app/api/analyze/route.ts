import { scoreWebsitePractices } from '@/lib/utils/scraper';
import chalk from 'chalk';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { url } = await req.json();

  if (!url) {
    return NextResponse.json(
      { error: 'Missing Url Parameter' },
      { status: 400 }
    );
  }

  try {
    console.log(chalk.blue('>>> Attempting to analyze URL:'), url);
    const {
      urls: { privacy, terms, data_handling },
      clauses,
    } = await scoreWebsitePractices(url);

    console.log(chalk.gray(`>>> ${privacy}`));
    console.log(chalk.gray(`>>> ${terms}`));
    console.log(chalk.gray(`>>> ${data_handling}`));

    return NextResponse.json(
      {
        privacy_url: privacy,
        terms_url: terms,
        data_handling_url: data_handling,
        clauses,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(chalk.red('Error in analyze route:'), error);
    return NextResponse.json(
      { error: 'Failed to analyze website practices' },
      { status: 500 }
    );
  }
}
