
import { ComicIllustration } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ComicIllustrationCardProps {
  comic: ComicIllustration;
}

const ComicIllustrationCard = ({ comic }: ComicIllustrationCardProps) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = comic.url;
    link.download = `comic-illustration-${comic.id}.png`;
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
            <CardTitle className="text-lg">Generated Comic Illustration</CardTitle>
          </div>
          <CardDescription>
            {new Date(comic.createdAt).toLocaleString()}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full rounded-md overflow-hidden bg-muted/20 p-2">
          <img 
            src={comic.url} 
            alt="Generated Comic Illustration"
            className="w-full object-contain mx-auto" 
            style={{ maxHeight: "600px" }}
          />
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button 
          className="flex-1" 
          variant="outline"
          onClick={() => window.open(comic.url, '_blank')}
        >
          View Full Image
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
