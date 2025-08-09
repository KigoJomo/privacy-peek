import chalk from 'chalk';
import { NextRequest, NextResponse } from 'next/server';
import analyzeWebsitePrivacy from './actions';

export async function POST(req: NextRequest) {
  const { url } = await req.json();

  if (!url) {
    return NextResponse.json(
      { error: 'Missing Url Parameter' },
      { status: 400 }
    );
  }

  try {
    console.log(chalk.blueBright('\n>>> Analyzing -> '), url);
    const score = await analyzeWebsitePrivacy({ url });

    return NextResponse.json({ score }, { status: 200 });
  } catch (error) {
    console.error(chalk.red('Error in analyze route:'), error);
    return NextResponse.json(
      { error: 'Failed to analyze website practices' },
      { status: 500 }
    );
  }
}
