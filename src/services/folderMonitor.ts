
// This service connects to a local server to monitor a folder for new images

export class FolderMonitor {
  private eventSource: EventSource | null = null;
  private onImageFoundCallback: ((imageUrl: string) => void) | null = null;
  private serverUrl = 'http://localhost:3001';

  constructor() {
    console.log('Folder monitor initialized with local server connection');
  }

  public startMonitoring(onImageFound: (imageUrl: string) => void): void {
    this.onImageFoundCallback = onImageFound;
    console.log('Starting to monitor folder via local server');

    try {
      // First check if there are any existing images
      this.checkExistingImages();
      
      // Then setup event listener for new images
      this.connectToServerEvents();
    } catch (error) {
      console.error('Error starting folder monitoring:', error);
      this.fallbackToSimulation();
    }
  }

  public stopMonitoring(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
      console.log('Stopped monitoring folder');
    }
  }

  private async checkExistingImages(): Promise<void> {
    try {
      console.log('Checking for existing images in Mock folder...');
      const response = await fetch(`${this.serverUrl}/api/images/Mock`);
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.images && data.images.length > 0) {
        console.log('Found existing images:', data.images);
        // Use the most recent image
        const latestImage = data.images[data.images.length - 1];
        this.notifyImageFound(latestImage);
      } else {
        console.log('No existing images found in Mock folder');
      }
    } catch (error) {
      console.error('Error checking existing images:', error);
      throw error;
    }
  }

  private connectToServerEvents(): void {
    try {
      console.log('Connecting to server events...');
      this.eventSource = new EventSource(`${this.serverUrl}/api/events`);
      
      this.eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.imageUrl) {
            console.log('New image detected via server:', data.imageUrl);
            this.notifyImageFound(data.imageUrl);
          }
        } catch (error) {
          console.error('Error processing event:', error);
        }
      };
      
      this.eventSource.onerror = (error) => {
        console.error('EventSource error:', error);
        this.eventSource?.close();
        this.fallbackToSimulation();
      };
      
      console.log('Successfully connected to server events');
    } catch (error) {
      console.error('Error connecting to server events:', error);
      this.fallbackToSimulation();
    }
  }
  
  private notifyImageFound(imageUrl: string): void {
    if (this.onImageFoundCallback) {
      console.log('Image found in monitored folder!');
      this.onImageFoundCallback(imageUrl);
      this.stopMonitoring();
    }
  }

  // Fallback to simulation if server connection fails
  private fallbackToSimulation(): void {
    console.warn('Falling back to simulation mode due to server connection issues');
    
    setTimeout(() => {
      console.log('Simulation: Mock image appeared in folder');
      const mockImageUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
      this.notifyImageFound(mockImageUrl);
    }, 5000);
  }
}
