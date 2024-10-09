import { Directive } from "@angular/core"

@Directive()
export class Spending {
  type: string;
  date: Date;
  description: string;
  amount: number;
  fee: number;
  currency: string;
  category: string;
  tag: string;

  constructor(data: any) {
    this.type = data.type;
    this.date = new Date(data.date);
    this.description = data.description;
    this.amount = data.amount;
    this.fee = data.fee;
    this.currency = data.currency;
    this.category = data.category;
    this.tag = data.tag;
  }
}
