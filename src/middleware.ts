import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = new URL(request.url)
  const from = url.pathname
  if (from === '/integration' || from === '/intégration') {
    url.pathname = '/integrations'
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/integration', '/intégration'],
}


