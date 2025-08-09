import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ status: 'OK' }, { status: 200 });
}

export async function POST(): Promise<NextResponse> {
  return NextResponse.json({ status: 'OK' }, { status: 200 });
}

export async function PATCH(): Promise<NextResponse> {
  return NextResponse.json({ status: 'OK' }, { status: 200 });
}

export async function DELETE(): Promise<NextResponse> {
  return NextResponse.json({ status: 'OK' }, { status: 200 });
}
