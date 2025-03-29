
import { PDFSummary } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

interface PDFSummaryCardProps {
  summary: PDFSummary;
}

const PDFSummaryCard = ({ summary }: PDFSummaryCardProps) => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <FileText className="text-primary h-5 w-5" />
          <CardTitle className="text-lg">{summary.fileName}</CardTitle>
        </div>
        <CardDescription>
          Processed on {new Date(summary.createdAt).toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-1">Summary</h3>
            <p className="text-sm text-muted-foreground">{summary.summary}</p>
          </div>
          
          <div>
            <h3 className="font-medium mb-1">Key Takeaways</h3>
            <ul className="list-disc list-inside space-y-1">
              {summary.keyTakeaways.map((takeaway, index) => (
                <li key={index} className="text-sm text-muted-foreground">{takeaway}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PDFSummaryCard;
