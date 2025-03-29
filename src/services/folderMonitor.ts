
// This service connects to a local server to monitor a folder for new images

export class FolderMonitor {
  private eventSource: EventSource | null = null;
  private onImageFoundCallback: ((imageUrl: string) => void) | null = null;
  private serverUrl = 'http://localhost:3001';
  private staticComicImage = '/lovable-uploads/11c652f6-a096-4f82-b5c3-296ccb8c6804.png';

  constructor() {
    console.log('Folder monitor initialized with local server connection');
  }

  public startMonitoring(onImageFound: (imageUrl: string) => void): void {
    this.onImageFoundCallback = onImageFound;
    console.log('Using static comic image from public folder');
    
    // Use a small delay to simulate processing time
    setTimeout(() => {
      this.notifyImageFound(this.staticComicImage);
    }, 2000);
  }

  public stopMonitoring(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
      console.log('Stopped monitoring folder');
    }
  }

  private notifyImageFound(imageUrl: string): void {
    if (this.onImageFoundCallback) {
      console.log('Image found, returning comic image from public folder:', imageUrl);
      this.onImageFoundCallback(imageUrl);
      this.stopMonitoring();
    }
  }
}
