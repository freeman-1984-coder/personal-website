import { NextResponse } from 'next/server';

export const revalidate = 3600; // Cache this route's response for 1 hour

export async function GET() {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/companies/public_treasury/bitcoin",
      {
        headers: { "User-Agent": "Mozilla/5.0 (Node.js Next.js Wrapper)" },
        next: { revalidate: 3600 }
      }
    );
    
    if (!response.ok) {
      throw new Error(`CoinGecko API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("MSTR API Route Error:", error);
    return NextResponse.json({ error: "Failed to fetch MSTR holdings" }, { status: 500 });
  }
}
