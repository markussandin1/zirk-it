
import { NextRequest, NextResponse } from 'next/server';

// This is the route that Facebook redirects the user back to after they log in.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Authorization code not found.' }, { status: 400 });
  }

  const clientId = process.env.FACEBOOK_APP_ID;
  const clientSecret = process.env.FACEBOOK_APP_SECRET;
  const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/auth/callback/facebook`;

  if (!clientId || !clientSecret) {
    throw new Error('Facebook App ID or Secret is not defined in environment variables');
  }

  // Step 1: Exchange the authorization code for an access token
  const tokenUrl = new URL('https://graph.facebook.com/v20.0/oauth/access_token');
  tokenUrl.searchParams.set('client_id', clientId);
  tokenUrl.searchParams.set('redirect_uri', redirectUri);
  tokenUrl.searchParams.set('client_secret', clientSecret);
  tokenUrl.searchParams.set('code', code);

  try {
    const tokenResponse = await fetch(tokenUrl.toString());
    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error('Error fetching access token:', tokenData.error);
      return NextResponse.json({ error: 'Failed to get access token', details: tokenData.error }, { status: 500 });
    }

    const accessToken = tokenData.access_token;

    // Step 2: Use the access token to get the user's accounts (pages)
    const accountsUrl = `https://graph.facebook.com/me/accounts?access_token=${accessToken}`;
    const accountsResponse = await fetch(accountsUrl);
    const accountsData = await accountsResponse.json();

    if (accountsData.error) {
        console.error('Error fetching accounts:', accountsData.error);
        return NextResponse.json({ error: 'Failed to get user accounts', details: accountsData.error }, { status: 500 });
    }

    // For now, we just return the data. In a real app, you would likely redirect the user
    // to their dashboard and use this data to populate the page generation form.
    return NextResponse.json({ 
      message: "Successfully fetched Facebook Page data!",
      pages: accountsData.data 
    });

  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
