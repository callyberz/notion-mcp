import * as cheerio from "cheerio";

export async function scrapeOgImage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; WishlistBot/1.0)" },
      signal: AbortSignal.timeout(5000),
    });
    const html = await res.text();
    const $ = cheerio.load(html);
    return $('meta[property="og:image"]').attr("content") ?? null;
  } catch {
    return null;
  }
}
