import { Injectable, signal, Signal } from '@angular/core';


@Injectable({ providedIn: 'root' })
export class PaginatorSignalService {
  private choosePageSize = signal<boolean>(false)

  public get pageSize(): Signal<boolean> {
    return this.choosePageSize
  }

  clickPageSize (value: boolean): void {
    this.choosePageSize.set(value)
  }

}
