"use client";

import { pinyin } from "pinyin-pro";

export interface CharPinyinPair {
  char: string;
  pinyin: string;
}

export function chineseToPinyin(text: string): string {
  if (!text) return "";
  try {
    return pinyin(text, { toneType: "symbol", type: "array" }).join(" ");
  } catch {
    return "";
  }
}

export function chineseToCharPinyinPairs(text: string): CharPinyinPair[] {
  if (!text) return [];
  
  try {
    const pinyinArray = pinyin(text, { toneType: "symbol", type: "array" });
    const pairs: CharPinyinPair[] = [];
    
    for (let i = 0; i < text.length; i++) {
      pairs.push({
        char: text[i],
        pinyin: pinyinArray[i] || text[i]
      });
    }
    
    return pairs;
  } catch {
    return text.split("").map(char => ({ char, pinyin: char }));
  }
}