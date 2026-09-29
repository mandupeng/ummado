'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { createAdSenseConfig } from '@pmd/core';

// ponytail: clientId/slot missing (not approved yet) → render nothing, never a broken ad unit.
const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? '';
const ads = clientId ? createAdSenseConfig(clientId, JSON.parse(process.env.NEXT_PUBLIC_ADSENSE_SLOTS ?? '{}')) : null;

export function AdSenseScript() {
  if (!ads) return null;
  return <Script async src={ads.scriptSrc} crossOrigin="anonymous" strategy="afterInteractive" />;
}

export function AdSlot({ name }: { name: string }) {
  const slot = ads?.slots[name];
  useEffect(() => {
    if (!slot) return;
    try {
      (window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle = (window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle || [];
      (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle.push({});
    } catch {
      // ponytail: swallowed — a failed ad push should never break the page
    }
  }, [slot]);
  if (!ads || !slot) return null;
  return (
    <ins
      className="adsbygoogle block"
      style={{ display: 'block' }}
      data-ad-client={ads.clientId}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
