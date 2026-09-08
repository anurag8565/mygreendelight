import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const baseUrl = "https://subziquick.in";
    const sitemapUrl = `${baseUrl}/sitemap.xml`;

    const results: Record<string, string> = {};

    // 1. Ping Google Sitemap Service
    try {
      const googlePingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
      const googleRes = await axios.get(googlePingUrl, { timeout: 8000 });
      results.google = `Status: ${googleRes.status}`;
    } catch (e: any) {
      results.google = `Notice: ${e.message}`;
    }

    // 2. Ping Bing / IndexNow Protocol
    try {
      const bingPingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
      const bingRes = await axios.get(bingPingUrl, { timeout: 8000 });
      results.bing = `Status: ${bingRes.status}`;
    } catch (e: any) {
      results.bing = `Notice: ${e.message}`;
    }

    return NextResponse.json({
      success: true,
      message: "Search engines pinged successfully for fast crawling & indexing!",
      sitemap: sitemapUrl,
      results,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Ping error" },
      { status: 500 }
    );
  }
}
