import { Component, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FilterComponent } from "./filter/filter.component";
import { FormsModule } from '@angular/forms';
import { FilterModel } from './models/FilterModel';
import { CommonModule } from '@angular/common';
import { SpendingAggregationComponent } from "./statistics/statistics.component";
import { Spending } from './models/Spending';
import { BackendService } from './service/BackendService';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FilterComponent, FormsModule, CommonModule, SpendingAggregationComponent],
  template: `
    <main class="main">
    <router-outlet />
    <div class="date-filters filter-section">
      <div class="filter" *ngFor="let filter of months; let i = index" [style.--delay]="(i + .3) * 0.15 + 's'">
        <filter [filter]="filter" (filterChanged)="onSelectedMonthChanged(filter)" />
      </div>
    </div>

    <div class="border"></div>
    
    <div class="spendings-incomes">
      <span class="spending-title">Costs</span>
      <statistics class="statistics costs" [spendings]="filteredSpendingCosts" [orderDescending]="false"></statistics>
      <span class="spending-title">Incomes</span>
      <statistics class="statistics incomes" [spendings]="filteredSpendingIncomes" [orderDescending]="true"></statistics>
    </div>
  </main>
  
  `,

  styleUrl: "./app.component.scss",
  animations: []
})



export class AppComponent {
  title = 'spending-tracker';
  monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  // todo: flip view
  // - months view: select a month and break down categories
  // - category view: select a category and break it down by month
  //      * multiselect categories: each month shows the selected categories
  MONTHS_ID = 1;
  CATEGORIES_ID = 2;

  months: FilterModel<number>[] = []
  allSpendings: Spending[] = [];
  spendingCosts: Spending[] = [];
  spendingIncomes: Spending[] = [];
  filteredSpendingCosts: Spending[] = [];
  filteredSpendingIncomes: Spending[] = [];

  constructor(public backendService: BackendService) { }

  ngOnInit(): void {
    var observable = this.backendService.fetchSpendings();
    observable.subscribe({
      next: (data) => {
        console.log(data);
        let spendings = this.parseSpendings(data as any[]);
        this.allSpendings = spendings;
        this.months = this.populateMonths(this.MONTHS_ID, spendings);
        this.resetSpendings();
      },
      error: (error) => console.error('Failed to fetch spendings', error)
    });
  }

  parseSpendings(data: any[]): Spending[] {
    return data.map(item => new Spending(item));
  }

  resetSpendings() {
    this.spendingCosts = this.allSpendings.filter(x => x.amount < 0);
    this.spendingIncomes = this.allSpendings.filter(x => x.amount > 0);
    this.filteredSpendingCosts = Array.from(this.spendingCosts);
    this.filteredSpendingIncomes = Array.from(this.spendingIncomes);
  }

  populateMonths(filterId: number, spendings: Spending[]): FilterModel<number>[] {
    let models: FilterModel<number>[] = [];
    Array.from(new Set(spendings.map(spending => spending.date.getMonth())))
      .map(month => {
        return {
          index: month,
          name: this.monthNames[month]
        }
      })
      .forEach(month => {
        let model: FilterModel<number> = {
          filterId: filterId, value: month.index, displayName: month.name, selected: false
        };
        models.push(model);
      });
    return models;
  }

  onSelectedMonthChanged(model: FilterModel<number>): void {

    this.resetSelection<number>(model, this.months);
    if (model.selected) {
      // filter locally
      // let filterFunc = (x: Spending) => x.date.getMonth() === model.value;
      // this.filteredSpendingCosts = this.spendingCosts.filter(filterFunc);
      // this.filteredSpendingIncomes = this.spendingIncomes.filter(filterFunc);

      // use server
      let observable = this.backendService.getSpendingsByMonth(model.value as number);
      observable.subscribe({
        next: data => {
          let spendings = this.parseSpendings(data);
          let filterFunc2 = (x: Spending) => x.date.getMonth() === model.value;
          this.filteredSpendingCosts = spendings.filter(filterFunc2);
          this.filteredSpendingIncomes = spendings.filter(filterFunc2);

        },
        error: error => console.error('Failed to fetch spendings by month', error)
      })
    }
    else {
      this.resetSpendings();
    }

  }

  resetSelection<T>(selectedFilter: FilterModel<T>, filters: FilterModel<T>[]) {
    if (selectedFilter.selected) {
      filters.forEach(f => {
        if (selectedFilter.value !== f.value && f.selected) {
          f.selected = false;
        }
      });
    }
  }
}