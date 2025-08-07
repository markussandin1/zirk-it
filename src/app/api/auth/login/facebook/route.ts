
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const clientId = process.env.FACEBOOK_APP_ID;
  if (!clientId) {
    throw new Error('FACEBOOK_APP_ID is not defined in environment variables');
  }

  const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/auth/callback/facebook`;

  // The permissions (scopes) we are requesting from the user.
  // These must match the ones you configured in your Meta App dashboard.
  const scope = [
    'public_profile',
    'email',
    'pages_show_list',
    'pages_read_engagement',
  ].join(',');

  const authUrl = new URL('https://www.facebook.com/v20.0/dialog/oauth');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('scope', scope);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('state', 'some_random_state_string'); // Should be a random, unguessable string for security

  return NextResponse.redirect(authUrl.toString());
}
