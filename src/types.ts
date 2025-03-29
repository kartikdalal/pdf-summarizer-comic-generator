
export interface PDFSummary {
  id: string;
  fileName: string;
  summary: string;
  keyTakeaways: string[];
  createdAt: string;
}

export interface ReferenceImage {
  id: string;
  fileName: string;
  url: string;
  createdAt: string;
}

export interface ComicIllustration {
  id: string;
  summaryId: string;
  imageId: string;
  url: string;
  createdAt: string;
}

export interface AppState {
  currentPDF: PDFSummary | null;
  currentReferenceImage: ReferenceImage | null;
  generatedComics: ComicIllustration[];
  isGeneratingComic: boolean;
}
