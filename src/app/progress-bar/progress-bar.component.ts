import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressService } from '../progress.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent {
  progress: number = 0;
  showImage: boolean = false;

  constructor(private progressService: ProgressService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(map => {
      console.log(map);
      const reset = map.has("reset");
      if (reset)
      {
        this.resetProgress();
        return;
      }
      
      const step = map.get("st") ?? "";
      console.log("Endpoint: " + step);
      if (step) {
        this.progress = this.progressService.incrementProgress(step);
        console.log("Progress: " + this.progress);
        if (this.progress >= 100) {
          this.showImage = true;
        }
      }
    });

    this.progress = this.progressService.getProgress();
    if (this.progress >= 100) {
      this.showImage = true;
    }
  }

  resetProgress(): void {
    this.progressService.resetProgress();
    this.progress = 0;
    this.showImage = false;
  }
}
