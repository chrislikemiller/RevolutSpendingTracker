import { Directive } from "@angular/core";

@Directive()
export class AggregatedCategory {
    constructor(public category: string, public currency: string, public total: number) {}

}
