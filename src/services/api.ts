
import { PDFSummary, ReferenceImage, ComicIllustration } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export const api = {
  uploadPDF: async (file: File): Promise<PDFSummary> => {
    try {
      // Read the PDF file content
      const fileContent = await readFileAsText(file);
      
      // Mock PDF summary generation (this would be replaced with actual AI processing)
      const summary = `This is a summary of ${file.name} with approximately ${Math.floor(fileContent.length / 100)} paragraphs.`;
      
      // Mock key takeaways extraction
      const keyTakeaways = [
        "First key takeaway from the document.",
        "Second important point extracted from the text.",
        "Third notable insight from the PDF content.",
        "Fourth critical concept mentioned in the document.",
        "Fifth significant finding in the uploaded material.",
        "Sixth relevant detail from the text analysis.",
        "Seventh interesting observation from the content.",
        "Eighth valuable piece of information extracted.",
        "Ninth meaningful conclusion drawn from the document.",
        "Tenth essential takeaway from the PDF."
      ];
      
      // Generate a unique ID for the PDF
      const id = generateId();
      
      // Store the PDF summary in Supabase
      const { data: comicSummary, error: summaryError } = await supabase
        .from('comic_summaries')
        .insert({
          id,
          title: file.name,
          content_name: file.name,
          content_type: 'pdf',
          takeaways: keyTakeaways,
        })
        .select()
        .single();
        
      if (summaryError) {
        console.error('Error storing PDF summary:', summaryError);
        throw new Error('Failed to store PDF summary');
      }

      const pdfSummary: PDFSummary = {
        id,
        fileName: file.name,
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

      // Upload the image to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('reference_images')
        .upload(filePath, file);

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
        id: generateId(),
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
        id: generateId(),
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
function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
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
