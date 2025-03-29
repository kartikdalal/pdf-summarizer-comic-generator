
import { useState } from 'react';
import { PDFSummary, ReferenceImage, ComicIllustration, AppState } from '@/types';
import Header from '@/components/Header';
import PDFUploader from '@/components/PDFUploader';
import PDFSummaryCard from '@/components/PDFSummaryCard';
import ImageUploader from '@/components/ImageUploader';
import ReferenceImageCard from '@/components/ReferenceImageCard';
import ComicGenerator from '@/components/ComicGenerator';
import ComicIllustrationCard from '@/components/ComicIllustrationCard';

const Index = () => {
  const [appState, setAppState] = useState<AppState>({
    currentPDF: null,
    currentReferenceImage: null,
    generatedComics: [],
    isGeneratingComic: false,
  });

  const handlePDFProcessed = (summary: PDFSummary) => {
    setAppState(prev => ({
      ...prev,
      currentPDF: summary,
    }));
  };

  const handleImageUploaded = (image: ReferenceImage) => {
    setAppState(prev => ({
      ...prev,
      currentReferenceImage: image,
    }));
  };

  const handleComicGenerated = (comic: ComicIllustration) => {
    setAppState(prev => ({
      ...prev,
      generatedComics: [comic, ...prev.generatedComics],
      isGeneratingComic: false,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            {!appState.currentPDF ? (
              <PDFUploader onPDFProcessed={handlePDFProcessed} />
            ) : (
              <PDFSummaryCard summary={appState.currentPDF} />
            )}
          </div>
          <div>
            {!appState.currentReferenceImage ? (
              <ImageUploader onImageUploaded={handleImageUploaded} />
            ) : (
              <ReferenceImageCard image={appState.currentReferenceImage} />
            )}
          </div>
        </div>

        <ComicGenerator
          pdfSummary={appState.currentPDF}
          referenceImage={appState.currentReferenceImage}
          onComicGenerated={handleComicGenerated}
        />

        {appState.generatedComics.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-heading font-bold">Generated Comics</h2>
            <div className="grid grid-cols-1 gap-6">
              {appState.generatedComics.map((comic) => (
                <ComicIllustrationCard key={comic.id} comic={comic} />
              ))}
            </div>
          </div>
        )}
      </main>
      <footer className="border-t py-4">
        <div className="container text-center text-sm text-muted-foreground">
          PDF Comic Generator &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};

export default Index;
