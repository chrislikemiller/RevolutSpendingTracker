import { Injectable } from '@angular/core';
import { Spending } from '../models/Spending';
import { AggregatedCategory } from './AggregatedCategory';

@Injectable({
  providedIn: 'root',
})
export class SpendingService {

  aggregateByCategory(spendings: Spending[], orderDescending: boolean): AggregatedCategory[] {
    const aggregation = spendings.reduce((acc: Record<string, AggregatedCategory>, spending) => {
        const key = `${spending.category}-${spending.currency}`;
        if (!acc[key]) {
          acc[key] = { category: spending.category, currency: spending.currency, total: 0 };
        }
          acc[key].total += spending.amount;
        return acc;
      }, {});

    return Object
          .values(aggregation)
          .map(x => {
            if (!orderDescending)
            {
              x.total *= -1;
            }
            return x;
          })
          .sort((a: AggregatedCategory, b: AggregatedCategory) => b.total - a.total);
    }
}
