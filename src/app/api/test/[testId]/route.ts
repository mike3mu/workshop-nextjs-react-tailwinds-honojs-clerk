import { NextRequest, NextResponse } from 'next/server';

export const PUT = (request: NextRequest, { params }: { params: { testId: string } }) => {
  return NextResponse.json({ hello: 'word', testId: params.testId });
};
