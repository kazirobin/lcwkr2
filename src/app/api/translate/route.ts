import { NextRequest, NextResponse } from "next/server";

interface TranslateRequest {
  text: string;
  sourceLang?: string;
  targetLang?: string;
}

interface MyMemoryResponse {
  responseData: {
    translatedText: string;
    match: number;
  };
  responseStatus: number;
  responseDetails: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: TranslateRequest = await request.json();
    const { text, sourceLang = "bn", targetLang = "zh-CN" } = body;

    if (!text || !text.trim()) {
      return NextResponse.json(
        { success: false, error: "Text is required" },
        { status: 400 }
      );
    }

    // Use MyMemory Translation API (free, no API key needed for basic usage)
    const apiUrl = "https://api.mymemory.translated.net/get";
    const params = new URLSearchParams({
      q: text.trim(),
      langpair: `${sourceLang}|${targetLang}`,
      // de: "lckwr@translate", // optional: email for higher limits
    });

    const response = await fetch(`${apiUrl}?${params.toString()}`, {
      method: "GET",
      headers: {
        "User-Agent": "LCWKR-Translate/1.0",
      },
      // Cache for 1 hour
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status}`);
    }

    const data: MyMemoryResponse = await response.json();

    if (data.responseStatus !== 200) {
      throw new Error(data.responseDetails || "Translation failed");
    }

    return NextResponse.json({
      success: true,
      translatedText: data.responseData.translatedText,
      sourceLang,
      targetLang,
      confidence: data.responseData.match,
    });
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Translation failed",
      },
      { status: 500 }
    );
  }
}