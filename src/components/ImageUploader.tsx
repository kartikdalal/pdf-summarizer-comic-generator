
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { api } from '@/services/api';
import { ReferenceImage } from '@/types';
import { useToast } from '@/components/ui/use-toast';

interface ImageUploaderProps {
  onImageUploaded: (image: ReferenceImage) => void;
}

const ImageUploader = ({ onImageUploaded }: ImageUploaderProps) => {
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
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    } else {
      setError('Please upload a valid image file');
      toast({
        title: 'Invalid file',
        description: 'Please upload a valid image file',
        variant: 'destructive',
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    } else if (file) {
      setError('Please upload a valid image file');
      toast({
        title: 'Invalid file',
        description: 'Please upload a valid image file',
        variant: 'destructive',
      });
    }
  };

  const processFile = async (file: File) => {
    setIsUploading(true);
    setError(null);
    
    try {
      const image = await api.uploadImage(file);
      toast({
        title: 'Image Uploaded',
        description: `Successfully uploaded ${file.name}`,
      });
      onImageUploaded(image);
    } catch (err) {
      console.error('Failed to upload image:', err);
      setError('Failed to upload image. Please try again.');
      toast({
        title: 'Upload failed',
        description: 'Failed to upload image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Upload Reference Image</CardTitle>
        <CardDescription>
          Upload an image to use as a style reference for the comic illustration
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
          onClick={() => document.getElementById('image-upload')?.click()}
        >
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <div className="flex flex-col items-center justify-center space-y-2">
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-sm text-muted-foreground">Uploading image...</p>
              </>
            ) : (
              <>
                <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="font-medium">
                  Drag and drop your image here, or click to browse
                </p>
                <p className="text-sm text-muted-foreground">
                  JPG, PNG or GIF files up to 5MB
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

export default ImageUploader;
