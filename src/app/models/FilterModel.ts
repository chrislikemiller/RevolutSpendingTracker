import { Directive } from "@angular/core"

@Directive()
export class FilterModel<T> {
    constructor(public filterId: number, public displayName: string,  public selected: boolean, public value?: T) { }
}
