
import { ComicIllustration } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ComicIllustrationCardProps {
  comic: ComicIllustration;
}

const ComicIllustrationCard = ({ comic }: ComicIllustrationCardProps) => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <BookOpen className="text-primary h-5 w-5" />
          <CardTitle className="text-lg">Generated Comic Illustration</CardTitle>
        </div>
        <CardDescription>
          Created on {new Date(comic.createdAt).toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-64 md:h-96 relative rounded-md overflow-hidden">
          <img 
            src={comic.url} 
            alt="Generated Comic Illustration"
            className="w-full h-full object-contain" 
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          variant="outline"
          onClick={() => window.open(comic.url, '_blank')}
        >
          View Full Image
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ComicIllustrationCard;
