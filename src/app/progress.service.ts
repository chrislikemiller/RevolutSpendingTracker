import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  private progress: number = 0;
  private visitedEndpoints: Set<string> = new Set();

  constructor() {
    // Load progress from localStorage when service initializes
    const storedProgress = localStorage.getItem('progress');
    const storedVisitedEndpoints = localStorage.getItem('visitedEndpoints');
    console.log("stored progress:");
    console.log(storedProgress);
    console.log(storedVisitedEndpoints);
    
    if (storedProgress) {
      this.progress = JSON.parse(storedProgress);
    }
    if (storedVisitedEndpoints) {
      this.visitedEndpoints = new Set(JSON.parse(storedVisitedEndpoints));
    }
  }

  incrementProgress(endpoint: string): number {
    if (!this.visitedEndpoints.has(endpoint)) {
      this.visitedEndpoints.add(endpoint);
      this.progress += 25;
      
      // Save to localStorage
      this.saveProgress();
    }
    return this.progress;
  }

  resetProgress(): void {
    this.progress = 0;
    this.visitedEndpoints.clear();
    
    // Save the reset state to localStorage
    this.saveProgress();
  }

  getProgress(): number {
    return this.progress;
  }

  private saveProgress(): void {
    localStorage.setItem('progress', JSON.stringify(this.progress));
    localStorage.setItem('visitedEndpoints', JSON.stringify([...this.visitedEndpoints]));
  }
}
