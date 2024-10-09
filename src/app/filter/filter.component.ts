import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilterModel } from '../models/FilterModel';

@Component({
  selector: 'filter',
  standalone: true,
  imports: [FormsModule],
  template: `

<main class="root checkbox-wrapper-16">
    <label class="checkbox-wrapper">
        <input class="checkbox-input" 
               type="checkbox" 
               (change)="onToggleSelection()"
               [(ngModel)]="filter.selected" />  
        <div class="tile">
            <div class="checkbox-label">{{ filter.displayName }}</div>
        </div>    
    </label>
</main>

  `,
  styleUrl: './filter.component.scss'
})
export class FilterComponent<T> {
  @Input() filter: FilterModel<T> = {filterId: 0, displayName: '', selected: false};
  @Output() filterChanged = new EventEmitter<FilterModel<T>>();

  onToggleSelection() {
    this.filterChanged.emit(this.filter);
  }
}
