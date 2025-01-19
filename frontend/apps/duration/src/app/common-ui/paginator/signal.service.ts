import { Injectable, signal, Signal } from '@angular/core';


@Injectable({ providedIn: 'root' })
export class PaginatorSignalService {
  public choosePageSize = signal<boolean>(false)


  clickPageSize (value: boolean): void {
    this.choosePageSize.set(value)
  }

}
