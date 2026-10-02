// src/features/vocabulary/pdf-reader/copy.ts
//
// Reader wording in one place. The reader is opened from two different parts
// of the site, so it cannot borrow the vocabulary page's copy object for
// labels the vocabulary page has no opinion about.

export interface ReaderCopy {
  zoomIn: string;
  zoomOut: string;
  zoomTo: string;
  fitWidth: string;
  fitPage: string;
  zoomLock: string;
  zoomLockOn: string;
  areaZoom: string;
  magnifier: string;
  rotate: string;
  theme: string;
  layout: string;
  single: string;
  continuous: string;
  twoPage: string;
  tools: string;
  toolNone: string;
  toolInk: string;
  toolHighlight: string;
  toolUnderline: string;
  toolNote: string;
  markColour: string;
  clearMarks: string;
  clearMarksConfirm: string;
  readAloud: string;
  stopReading: string;
  search: string;
  searchPlaceholder: string;
  searchPrev: string;
  searchNext: string;
  searchNone: string;
  searchScanned: string;
  more: string;
  fewer: string;
  fullscreen: string;
  exitFullscreen: string;
  back: string;
  close: string;
  openNewTab: string;
  download: string;
  page: string;
  noTextOnPage: string;
  noTextInBook: string;
  notePrompt: string;
  noteSave: string;
  noteCancel: string;
  dictionary: string;
  copySelection: string;
  speakSelection: string;
  markColourNames: Record<string, string>;
}

export const READER_COPY: Record<"bn" | "en", ReaderCopy> = {
  en: {
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
    zoomTo: "Zoom percentage",
    fitWidth: "Fit to width",
    fitPage: "Fit whole page",
    zoomLock: "Keep this zoom on every page",
    zoomLockOn: "Zoom locked",
    areaZoom: "Zoom into a box you drag",
    magnifier: "Magnifying glass",
    rotate: "Rotate",
    theme: "Reading theme",
    layout: "Page layout",
    single: "One page",
    continuous: "Scroll",
    twoPage: "Two pages",
    tools: "Mark up",
    toolNone: "Read only",
    toolInk: "Pen",
    toolHighlight: "Highlight",
    toolUnderline: "Underline",
    toolNote: "Sticky note",
    markColour: "Ink colour",
    clearMarks: "Remove all my marks",
    clearMarksConfirm: "Remove every mark? This cannot be undone.",
    readAloud: "Read this page aloud",
    stopReading: "Stop reading",
    search: "Search in this book",
    searchPlaceholder: "Type a word",
    searchPrev: "Previous match",
    searchNext: "Next match",
    searchNone: "Not found in this book",
    searchScanned: "This book is a scan, so its text cannot be searched.",
    more: "More tools",
    fewer: "Fewer tools",
    fullscreen: "Full screen",
    exitFullscreen: "Leave full screen",
    back: "Back",
    close: "Close",
    openNewTab: "Open the file in a new tab",
    download: "Download",
    page: "Page",
    noTextOnPage: "No selectable text on this page",
    noTextInBook: "This book is a scan — text tools are unavailable",
    notePrompt: "Your note",
    noteSave: "Save",
    noteCancel: "Cancel",
    dictionary: "Look up",
    copySelection: "Copy",
    speakSelection: "Say it",
    markColourNames: {
      yellow: "Yellow",
      green: "Green",
      blue: "Blue",
      pink: "Pink",
      orange: "Orange",
    },
  },
  bn: {
    zoomIn: "বড় করুন",
    zoomOut: "ছোট করুন",
    zoomTo: "জুমের পার্সেন্ট",
    fitWidth: "প্রস্থের সাথে মানান",
    fitPage: "পুরো পেজ দেখান",
    zoomLock: "প্রতিটি পেজে এই জুম থাকবে",
    zoomLockOn: "জুম লক করা",
    areaZoom: "বাক্স টেনে জুম করুন",
    magnifier: "ম্যাগনিফায়ার",
    rotate: "ঘোরান",
    theme: "পড়ার থিম",
    layout: "পেজের বিন্যাস",
    single: "একটি পেজ",
    continuous: "স্ক্রল",
    twoPage: "দুই পেজ",
    tools: "মার্ক করুন",
    toolNone: "শুধু পড়া",
    toolInk: "পেন",
    toolHighlight: "হাইলাইট",
    toolUnderline: "নিচে লাইন",
    toolNote: "স্টিকি নোট",
    markColour: "কালার",
    clearMarks: "আমার সব মার্ক মুছুন",
    clearMarksConfirm: "সব মার্ক মুছে ফেলবে? এটি ফেরানো যাবে না।",
    readAloud: "এই পেজ পড়ে শোনাও",
    stopReading: "থামাও",
    search: "বইয়ে খুঁজুন",
    searchPlaceholder: "শব্দ লিখুন",
    searchPrev: "আগের মিল",
    searchNext: "পরের মিল",
    searchNone: "বইয়ে পাওয়া যায়নি",
    searchScanned: "এই বইটি স্ক্যান করা, তাই লেখা খোঁজা যায় না।",
    more: "আরও টুল",
    fewer: "কম টুল",
    fullscreen: "ফুল স্ক্রিন",
    exitFullscreen: "ফুল স্ক্রিন ছাড়ুন",
    back: "পেছনে",
    close: "বন্ধ",
    openNewTab: "নতুন ট্যাবে ফাইল খুলুন",
    download: "ডাউনলোড",
    page: "পেজ",
    noTextOnPage: "এই পেজে নির্বাচনযোগ্য লেখা নেই",
    noTextInBook: "এই বইটি স্ক্যান করা — লেখার টুল কাজ করবে না",
    notePrompt: "আপনার নোট",
    noteSave: "সেভ করুন",
    noteCancel: "বাতিল",
    dictionary: "অর্থ দেখুন",
    copySelection: "কপি",
    speakSelection: "পড়ে শোনান",
    markColourNames: {
      yellow: "হলুদ",
      green: "সবুজ",
      blue: "নীল",
      pink: "গোলাপি",
      orange: "কমলা",
    },
  },
};
