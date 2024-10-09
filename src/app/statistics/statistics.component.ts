import { Component, OnInit, Input } from '@angular/core';
import { SpendingService } from './SpendingService';
import { AggregatedCategory } from './AggregatedCategory';
import { CommonModule } from '@angular/common';
import { Spending } from '../models/Spending';

@Component({
  selector: 'statistics',
  standalone: true,
  imports: [CommonModule],
  template: `
  
  <div class="aggregation" *ngFor="let item of aggregatedSpendings; let i = index" [style.--delay]="(i + .1) * 0.05 + 's'">
    <div class="aggregation-item">
      <span class="category-title">{{ item.category }}</span>
      <span>{{ item.total.toLocaleString("en-us", { maximumFractionDigits:0 }) }} {{ item.currency }}</span>
    </div>
  </div>
  
  `,
  styleUrl: "./statistics.component.scss"
})

export class SpendingAggregationComponent implements OnInit {
  aggregatedSpendings: AggregatedCategory[] = [];
  @Input() orderDescending: boolean = false;

  private _spendings: Spending[] = [];
  @Input()
  public get spendings(): Spending[] {
    return this._spendings;
  }
  public set spendings(value: Spending[]) {
    this._spendings = value;
    this.aggregate(this._spendings, this.orderDescending);
  }

  constructor(private spendingService: SpendingService) { }

  ngOnInit() {
    this.aggregate(this._spendings, this.orderDescending);
  }


  aggregate(spendings: Spending[], orderDescending: boolean) {
    this.aggregatedSpendings = this.spendingService.aggregateByCategory(spendings, orderDescending);
  }
}
