
import { BookOpen } from 'lucide-react';

const Header = () => {
  return (
    <header className="border-b">
      <div className="container flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <h1 className="font-heading text-2xl font-bold">PDF Comic Generator</h1>
        </div>
        <div className="text-sm text-muted-foreground">
          Transform documents into visual stories
        </div>
      </div>
    </header>
  );
};

export default Header;
