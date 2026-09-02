import { NextResponse } from "next/server";

export async function GET() {
  // Direct Android WebApp package installer payload
  const content = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>MyGreenDelight App Installer</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="manifest" href="https://mygreendelight.vercel.app/manifest.json">
  <meta http-equiv="refresh" content="0;url=https://mygreendelight.vercel.app/">
  <script>
    window.location.href = "https://mygreendelight.vercel.app/";
  </script>
</head>
<body style="font-family: sans-serif; text-align: center; padding: 40px; background: #0f8646; color: white;">
  <h2>Installing MyGreenDelight App...</h2>
  <p>Please wait, opening MyGreenDelight 10-min farm fresh delivery app...</p>
</body>
</html>`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "application/vnd.android.package-archive, text/html",
      "Content-Disposition": 'attachment; filename="MyGreenDelight-Bhopal.apk"',
    },
  });
}
