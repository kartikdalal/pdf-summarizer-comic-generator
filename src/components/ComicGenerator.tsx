
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Wand2, AlertCircle, RotateCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { PDFSummary, ReferenceImage, ComicIllustration } from '@/types';
import { api } from '@/services/api';
import { FolderMonitor } from '@/services/folderMonitor';

interface ComicGeneratorProps {
  pdfSummary: PDFSummary | null;
  referenceImage: ReferenceImage | null;
  onComicGenerated: (comic: ComicIllustration) => void;
}

const ComicGenerator = ({ pdfSummary, referenceImage, onComicGenerated }: ComicGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [folderMonitor, setFolderMonitor] = useState<FolderMonitor | null>(null);
  const [pendingComic, setPendingComic] = useState<ComicIllustration | null>(null);
  const { toast } = useToast();

  const canGenerate = !!pdfSummary && !!referenceImage && !isGenerating;

  useEffect(() => {
    // Initialize the folder monitor
    const monitor = new FolderMonitor();
    setFolderMonitor(monitor);

    return () => {
      // Clean up when component unmounts
      if (monitor) {
        monitor.stopMonitoring();
      }
    };
  }, []);

  const handleGenerateComic = async () => {
    if (!pdfSummary || !referenceImage || !folderMonitor) return;

    setIsGenerating(true);
    setError(null);
    
    try {
      // Start the comic generation process
      const comic = await api.generateComic(pdfSummary.id, referenceImage.id);
      setPendingComic(comic);
      
      // Start monitoring the folder
      setIsMonitoring(true);
      toast({
        title: 'Comic Generation Started',
        description: 'Monitoring folder for the generated image...',
      });
      
      folderMonitor.startMonitoring((imageUrl: string) => {
        // When an image is found in the folder
        const updatedComic = { ...comic, url: imageUrl };
        setPendingComic(null);
        setIsMonitoring(false);
        onComicGenerated(updatedComic);
        
        toast({
          title: 'Comic Generated',
          description: 'Successfully generated comic illustration!',
        });
        setIsGenerating(false);
      });
    } catch (err) {
      console.error('Failed to generate comic:', err);
      setError('Failed to generate comic. Please try again.');
      setIsMonitoring(false);
      
      toast({
        title: 'Generation failed',
        description: 'Failed to generate comic. Please try again.',
        variant: 'destructive',
      });
      setIsGenerating(false);
    }
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

          {isMonitoring && (
            <div className="p-4 border rounded-lg bg-muted/30">
              <div className="flex items-center gap-2 mb-2">
                <RotateCw className="h-4 w-4 animate-spin text-primary" />
                <span className="font-medium">Monitoring folder for generated image</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Once detected in your folder, the comic illustration will appear here.
              </p>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}
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
