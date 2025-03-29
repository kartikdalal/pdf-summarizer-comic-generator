import { PDFSummary, ReferenceImage, ComicIllustration } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export const api = {
  uploadPDF: async (file: File): Promise<PDFSummary> => {
    try {
      // Read the PDF file content
      const fileContent = await readFileAsArrayBuffer(file);
      
      // In a real implementation, we would send this to an AI model
      // For now, we'll create a more realistic mock of PDF summary generation
      
      // Generate a proper UUID for the PDF
      const id = uuidv4();
      
      // Extract more realistic mock data
      const fileName = file.name;
      const fileSizeInKB = Math.round(file.size / 1024);
      const summary = `This is a summary of ${fileName} (${fileSizeInKB}KB). The document appears to contain information about ${getRandomTopic()}. It has approximately ${Math.floor(file.size / 1000)} paragraphs of content.`;
      
      // Generate more realistic key takeaways
      const keyTakeaways = generateMockTakeaways(fileName);
      
      // Store the PDF summary in Supabase
      const { data: summaryData, error: summaryError } = await supabase
        .from('comic_summaries')
        .insert({
          id,
          title: fileName,
          content_name: fileName,
          content_type: 'pdf',
          takeaways: keyTakeaways,
        })
        .select();
        
      if (summaryError) {
        console.error('Error storing PDF summary:', summaryError);
        throw new Error('Failed to store PDF summary');
      }

      console.log('Summary stored in Supabase:', summaryData);
      
      // Store takeaways in the new pdf_takeaways table
      const { data: takeawaysData, error: takeawaysError } = await supabase
        .from('pdf_takeaways')
        .insert({
          pdf_id: id,
          takeaways: keyTakeaways,
        })
        .select();
        
      if (takeawaysError) {
        console.error('Error storing PDF takeaways:', takeawaysError);
        // Continue execution even if takeaways storage fails
        // We don't want to block the whole process for this
      } else {
        console.log('Takeaways stored in Supabase:', takeawaysData);
      }

      const pdfSummary: PDFSummary = {
        id,
        fileName,
        summary,
        keyTakeaways,
        createdAt: new Date().toISOString(),
      };

      console.log('PDF uploaded and summarized:', pdfSummary);
      return pdfSummary;
    } catch (error) {
      console.error('Error processing PDF:', error);
      throw new Error('Failed to process PDF file');
    }
  },

  uploadImage: async (file: File): Promise<ReferenceImage> => {
    try {
      // Generate a unique file path for the image
      const filePath = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;

      // Now that we have the proper RLS policies, we can upload directly
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('reference_images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('Error uploading image to storage:', uploadError);
        throw new Error('Failed to upload image to storage');
      }

      // Get the public URL of the uploaded image
      const { data: publicUrlData } = supabase.storage
        .from('reference_images')
        .getPublicUrl(filePath);

      if (!publicUrlData || !publicUrlData.publicUrl) {
        throw new Error('Failed to get public URL for uploaded image');
      }

      const referenceImage: ReferenceImage = {
        id: uuidv4(),
        fileName: file.name,
        url: publicUrlData.publicUrl,
        createdAt: new Date().toISOString(),
      };

      console.log('Image uploaded:', referenceImage);
      return referenceImage;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  },

  generateComic: async (summaryId: string, imageId: string): Promise<ComicIllustration> => {
    try {
      // In a real implementation, this would trigger a server process to generate the comic
      // For now, we'll implement the folder monitoring part
      
      const comicIllustration: ComicIllustration = {
        id: uuidv4(),
        summaryId,
        imageId,
        url: '',  // Will be populated when we detect the image
        createdAt: new Date().toISOString(),
      };

      console.log('Comic generation initiated:', comicIllustration);
      return comicIllustration;
    } catch (error) {
      console.error('Error generating comic:', error);
      throw new Error('Failed to generate comic illustration');
    }
  }
};

// Helper functions
function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// New helper functions to create more realistic mock data
function getRandomTopic(): string {
  const topics = [
    "business strategy", 
    "financial analysis", 
    "market research", 
    "technological innovation", 
    "scientific research", 
    "environmental sustainability", 
    "project management", 
    "corporate governance",
    "product development",
    "industry trends"
  ];
  return topics[Math.floor(Math.random() * topics.length)];
}

function generateMockTakeaways(fileName: string): string[] {
  const fileNameLower = fileName.toLowerCase();
  let domain = "general business";
  
  if (fileNameLower.includes("financial") || fileNameLower.includes("finance") || fileNameLower.includes("report")) {
    domain = "financial";
  } else if (fileNameLower.includes("market") || fileNameLower.includes("research")) {
    domain = "market research";
  } else if (fileNameLower.includes("tech") || fileNameLower.includes("product")) {
    domain = "technology";
  } else if (fileNameLower.includes("strategy") || fileNameLower.includes("plan")) {
    domain = "strategic planning";
  }
  
  const takeawaysByDomain: Record<string, string[]> = {
    "financial": [
      "Revenue increased by 12% year-over-year in Q4 2024.",
      "Operating expenses decreased by 8% due to cost optimization measures.",
      "Profit margins improved from 18% to 23% across all business segments.",
      "Cash reserves reached $45 million, a 15% increase from previous quarter.",
      "R&D investments accounted for 15% of total expenditure.",
      "Customer acquisition cost decreased by 22% through digital optimization.",
      "Projected growth for next fiscal year set at 14-16% range.",
      "New product lines contributed 28% to overall revenue stream.",
      "International markets showed 34% growth compared to domestic growth of 9%.",
      "Debt-to-equity ratio improved from 0.8 to 0.6 indicating stronger financial position."
    ],
    "market research": [
      "Target demographic shows 28% higher engagement with video content.",
      "Customer satisfaction scores increased by 15 points after new feature rollout.",
      "72% of users prefer mobile platforms over desktop for daily interactions.",
      "Competitor analysis reveals a market gap in mid-tier pricing segments.",
      "Brand awareness increased by 34% following the Q3 marketing campaign.",
      "User retention rates 45% higher for customers using multiple product features.",
      "Price sensitivity testing suggests optimal pricing at $29.99 for core product.",
      "Social media engagement metrics show 3x higher conversion on Instagram vs Facebook.",
      "Customer journey analysis identified 3 critical touchpoints for improvement.",
      "Regional analysis shows 52% stronger product-market fit in coastal urban areas."
    ],
    "technology": [
      "New infrastructure reduced system latency by 68% during peak usage.",
      "Machine learning model improved prediction accuracy from 83% to 91%.",
      "API response times decreased by 42% after backend optimization.",
      "Cloud migration reduced operational costs by 35% over on-premise solutions.",
      "Security enhancements blocked 99.7% of detected breach attempts.",
      "Mobile app crash rate reduced to under 0.5% following recent update.",
      "Database indexing improvements led to 78% faster query performance.",
      "New microservices architecture enables 5x faster feature deployment.",
      "Edge computing implementation reduced data transfer needs by 62%.",
      "Frontend redesign improved loading speeds by 2.4 seconds on average."
    ],
    "strategic planning": [
      "Market expansion into APAC region projected to increase revenue by 23%.",
      "New partnership model expected to reduce customer acquisition costs by 31%.",
      "Three key product lines identified for strategic divestment by Q2 2025.",
      "Vertical integration opportunities could improve margins by 8-12%.",
      "Digital transformation initiatives expected to yield 26% operational efficiency.",
      "Customer segmentation analysis revealed 4 high-value personas for targeting.",
      "Subscription-based pricing model projected to increase LTV by 47%.",
      "Talent acquisition strategy aims to reduce hiring time by 40% for critical roles.",
      "Supply chain optimization could reduce costs by 18% over 24 months.",
      "ESG initiatives expected to improve brand sentiment by 25% among key demographics."
    ],
    "general business": [
      "Core business operations saw 15% efficiency improvement in last quarter.",
      "Customer satisfaction ratings increased from 4.2 to 4.7 out of 5.",
      "Employee retention rate improved by 18% following culture initiatives.",
      "Digital transformation reduced manual processing time by 42%.",
      "New partnerships expanded market reach by approximately 3 million potential customers.",
      "Product quality metrics improved with defect rates dropping below 0.3%.",
      "Process automation initiatives saved an estimated 12,000 work hours annually.",
      "Customer feedback implementation led to 28% higher engagement metrics.",
      "Organizational restructuring improved decision-making speed by 37%.",
      "Sustainability initiatives reduced carbon footprint by 24% year-over-year."
    ]
  };
  
  return takeawaysByDomain[domain] || takeawaysByDomain["general business"];
}
