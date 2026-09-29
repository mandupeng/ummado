export async function GET() {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  if (!clientId) {
    return new Response('No AdSense client ID configured', { status: 404 });
  }

  const content = `google.com, ${clientId}, DIRECT, f08c47fec0942fa0`;
  return new Response(content, {
    headers: { 'Content-Type': 'text/plain' },
  });
}
