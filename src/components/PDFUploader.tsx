
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud, FileText, AlertCircle } from 'lucide-react';
import { api } from '@/services/api';
import { PDFSummary } from '@/types';
import { useToast } from '@/components/ui/use-toast';

interface PDFUploaderProps {
  onPDFProcessed: (summary: PDFSummary) => void;
}

const PDFUploader = ({ onPDFProcessed }: PDFUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      processFile(file);
    } else {
      setError('Please upload a valid PDF file');
      toast({
        title: 'Invalid file',
        description: 'Please upload a valid PDF file',
        variant: 'destructive',
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      processFile(file);
    } else if (file) {
      setError('Please upload a valid PDF file');
      toast({
        title: 'Invalid file',
        description: 'Please upload a valid PDF file',
        variant: 'destructive',
      });
    }
  };

  const processFile = async (file: File) => {
    setIsUploading(true);
    setError(null);
    
    try {
      const summary = await api.uploadPDF(file);
      toast({
        title: 'PDF Processed',
        description: `Successfully processed ${file.name}`,
      });
      onPDFProcessed(summary);
    } catch (err) {
      console.error('Failed to process PDF:', err);
      setError('Failed to process PDF. Please try again.');
      toast({
        title: 'Processing failed',
        description: 'Failed to process PDF. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Upload PDF Document</CardTitle>
        <CardDescription>
          Upload a PDF to extract a summary and key takeaways
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragging ? 'border-primary bg-primary/5' : 'border-border'
          } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('pdf-upload')?.click()}
        >
          <input
            id="pdf-upload"
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <div className="flex flex-col items-center justify-center space-y-2">
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-sm text-muted-foreground">Processing PDF...</p>
              </>
            ) : (
              <>
                <UploadCloud className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="font-medium">
                  Drag and drop your PDF here, or click to browse
                </p>
                <p className="text-sm text-muted-foreground">
                  PDF files up to 10MB
                </p>
              </>
            )}
          </div>
        </div>
        {error && (
          <div className="mt-4 flex items-center gap-2 text-destructive text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PDFUploader;
