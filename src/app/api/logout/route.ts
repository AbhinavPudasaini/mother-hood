import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const response = NextResponse.redirect(new URL('/', req.url));
  response.cookies.set('userId', '', { expires: new Date(0), path: '/' });
  return response;
}