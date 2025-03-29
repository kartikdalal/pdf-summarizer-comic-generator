
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Wand2, RotateCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { PDFSummary, ReferenceImage, ComicIllustration } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { FolderMonitor } from '@/services/folderMonitor';

interface ComicGeneratorProps {
  pdfSummary: PDFSummary | null;
  referenceImage: ReferenceImage | null;
  onComicGenerated: (comic: ComicIllustration) => void;
}

const ComicGenerator = ({ pdfSummary, referenceImage, onComicGenerated }: ComicGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const canGenerate = !!pdfSummary && !!referenceImage && !isGenerating;

  const handleGenerateComic = async () => {
    if (!pdfSummary || !referenceImage) return;

    setIsGenerating(true);
    toast({
      title: 'Comic Generation Started',
      description: 'Creating your comic illustration...',
    });
    
    // Create a new FolderMonitor instance for this generation
    const folderMonitor = new FolderMonitor();
    
    // Create a new comic illustration object
    const comic: ComicIllustration = {
      id: uuidv4(),
      summaryId: pdfSummary.id,
      imageId: referenceImage.id,
      url: '', // Will be populated when the image is found
      createdAt: new Date().toISOString(),
    };
    
    // Start monitoring for the image
    folderMonitor.startMonitoring((imageUrl: string) => {
      // Update the comic with the new image URL
      const updatedComic = { ...comic, url: imageUrl };
      
      // Notify the parent component
      onComicGenerated(updatedComic);
      
      toast({
        title: 'Comic Generated',
        description: 'Successfully generated comic illustration!',
      });
      
      setIsGenerating(false);
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Generate Comic Illustration</CardTitle>
        <CardDescription>
          Create a comic illustration based on the PDF summary and reference image
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border p-3">
              <div className="font-medium mb-1 text-sm">PDF Status</div>
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${pdfSummary ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className="text-sm">{pdfSummary ? 'Ready' : 'Upload a PDF'}</span>
              </div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="font-medium mb-1 text-sm">Image Status</div>
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${referenceImage ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className="text-sm">{referenceImage ? 'Ready' : 'Upload an image'}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleGenerateComic}
          disabled={!canGenerate}
        >
          {isGenerating ? (
            <>
              <RotateCw className="mr-2 h-4 w-4 animate-spin" />
              Generating Comic...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Generate Comic Illustration
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ComicGenerator;
