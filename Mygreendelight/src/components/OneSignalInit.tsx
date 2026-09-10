"use client";

import Script from "next/script";

export default function OneSignalInit() {
  return (
    <>
      <Script
        src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
        strategy="afterInteractive"
      />
      <Script id="onesignal-init" strategy="afterInteractive">
        {`
          window.OneSignalDeferred = window.OneSignalDeferred || [];
          OneSignalDeferred.push(async function(OneSignal) {
            await OneSignal.init({
              appId: "6fa7f8ec-5436-446f-93b4-7b4bcad7055d",
              serviceWorkerParam: { scope: "/" },
              serviceWorkerPath: "/OneSignalSDKWorker.js",
              allowLocalhostAsSecureOrigin: true,
            });
          });
        `}
      </Script>
    </>
  );
}
