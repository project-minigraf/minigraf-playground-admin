import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const authHeader = req.headers.get('authorization')

  if (authHeader) {
    const [scheme, encoded] = authHeader.split(' ')
    if (scheme === 'Basic' && encoded) {
      const decoded = Buffer.from(encoded, 'base64').toString('utf-8')
      const pass = decoded.split(':').slice(1).join(':')
      if (pass === process.env.ADMIN_PASSWORD) {
        return NextResponse.next()
      }
    }
  }

  return new NextResponse(null, {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Minigraf Analytics"',
    },
  })
}

export const config = {
  matcher: ['/((?!_next|favicon.ico).*)'],
}
