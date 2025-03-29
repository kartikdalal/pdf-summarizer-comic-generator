
import { ReferenceImage } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Image as ImageIcon } from 'lucide-react';

interface ReferenceImageCardProps {
  image: ReferenceImage;
}

const ReferenceImageCard = ({ image }: ReferenceImageCardProps) => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <ImageIcon className="text-primary h-5 w-5" />
          <CardTitle className="text-lg">{image.fileName}</CardTitle>
        </div>
        <CardDescription>
          Uploaded on {new Date(image.createdAt).toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-48 md:h-64 relative rounded-md overflow-hidden">
          <img 
            src={image.url} 
            alt={image.fileName}
            className="w-full h-full object-cover" 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferenceImageCard;
