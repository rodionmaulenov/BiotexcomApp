import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, signal, ViewChild, WritableSignal
} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {FormArray, FormGroup} from '@angular/forms';
import {MatTable} from '@angular/material/table';
import {TableFields} from '../dates-change-table/dates-change-table.component';


@Component({
  selector: 'app-paginator',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatPaginator],
  template: `
    <div class="ctm-paginator">
      <mat-paginator [length]="length"
                     [pageSizeOptions]="[3, 4, 5, 7]"
                     [pageSize]="pageSize"
                     [pageIndex]="pageIndex"
                     (page)="onPageChange($event)"
                     aria-label="Select page of results">
      </mat-paginator>
    </div>
  `,
  styleUrl: './paginator.component.scss'
})
export class PaginatorComponent {
  protected readonly cdr = inject(ChangeDetectorRef)

  formArray: WritableSignal<FormArray<FormGroup> | null> = signal(null)
  table: WritableSignal<MatTable<TableFields> | null> = signal(null)
  paginatedData: WritableSignal<FormGroup[]> = signal([])

  @ViewChild(MatPaginator) matPaginator!: MatPaginator

  protected length = 0
  protected pageIndex = 0
  protected pageSize = 3


  protected onPageChange(event: { pageIndex: number; pageSize: number }): void {
    this.pageIndex = event.pageIndex
    this.pageSize = event.pageSize
    this.updatePaginatedData()
  }

  /** Update paginated data */
  public updatePaginatedData(): void {
    const formArrayValue = this.formArray()
    const table = this.table()

    if (formArrayValue) {
      const visibleRows = formArrayValue.controls.filter(
        (control) => !control.get('deleted')?.value
      )

      this.length = visibleRows.length

      // Adjust current page index if necessary
      const totalPages = Math.ceil(visibleRows.length / this.pageSize)
      if (this.pageIndex >= totalPages && totalPages > 0) {
        this.pageIndex = totalPages - 1
      }

      const startIndex = this.pageIndex * this.pageSize
      const endIndex = startIndex + this.pageSize

      this.paginatedData.set(visibleRows.slice(startIndex, endIndex))

      if (table) table.renderRows()

      this.cdr.markForCheck()
    }
  }


  public gotoLastPage(): void {
    const formArrayValue = this.formArray()
    if (formArrayValue) {
      const totalItems = formArrayValue.length
      this.pageIndex = Math.max(Math.ceil(totalItems / this.pageSize) - 1, 0)
      this.updatePaginatedData()
    }
  }

}
