
import { ComicIllustration } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

interface ComicIllustrationCardProps {
  comic: ComicIllustration;
}

const ComicIllustrationCard = ({ comic }: ComicIllustrationCardProps) => {
  const [isVideo, setIsVideo] = useState<boolean>(false);

  useEffect(() => {
    // Check if the URL ends with a video extension
    const url = comic.url.toLowerCase();
    setIsVideo(url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mov'));
  }, [comic.url]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = comic.url;
    link.download = isVideo ? 
      `comic-video-${comic.id}.${comic.url.split('.').pop()}` : 
      `comic-illustration-${comic.id}.${comic.url.split('.').pop() || 'png'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="text-primary h-5 w-5" />
            <CardTitle className="text-lg">
              {isVideo ? 'Generated Comic Video' : 'Generated Comic Illustration'}
            </CardTitle>
          </div>
          <CardDescription>
            {new Date(comic.createdAt).toLocaleString()}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full rounded-md overflow-hidden bg-muted/20 p-2">
          {isVideo ? (
            <video 
              src={comic.url}
              controls
              className="w-full object-contain mx-auto"
              style={{ maxHeight: "600px" }}
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <img 
              src={comic.url} 
              alt="Generated Comic Illustration"
              className="w-full object-contain mx-auto" 
              style={{ maxHeight: "600px" }}
            />
          )}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button 
          className="flex-1" 
          variant="outline"
          onClick={() => window.open(comic.url, '_blank')}
        >
          View Full {isVideo ? 'Video' : 'Image'}
        </Button>
        <Button 
          className="flex-1" 
          onClick={handleDownload}
        >
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ComicIllustrationCard;
