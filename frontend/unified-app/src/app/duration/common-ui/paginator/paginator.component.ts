import {
  ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output, Renderer2,
} from '@angular/core';
import {MatPaginatorIntl, MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {getRussianPaginatorIntl} from '../../data/rus_paginator/rus,paginator';
import {PaginationDetails} from '../../data/interfaces/profile.interface';
import {PaginatorSignalService} from './signal.service';


@Component({
  selector: 'app-paginator',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatPaginatorModule,],
  providers: [
    {provide: MatPaginatorIntl, useValue: getRussianPaginatorIntl()},
  ],
  template: `
    <mat-paginator
      [length]="pagination.count"
      [pageSize]="pageSize"
      [pageIndex]="pageIndex"
      [pageSizeOptions]="[5, 10, 25, 50]"
      aria-label="Select page"
      (page)="onPageChange($event)">
    </mat-paginator>
  `,
  styleUrl: './paginator.component.scss',
})
export class PaginatorComponent implements OnDestroy {
  private paginator = inject(PaginatorSignalService)
  private renderer = inject(Renderer2)

  @Input() pagination: PaginationDetails = {count: 0, next: null, previous: null}
  @Input() pageSize = 5
  @Input() pageIndex = 0
  @Output() pageChange = new EventEmitter<PageEvent>()

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize
    this.paginator.clickPageSize(true)
    this.pageChange.emit(event)
    this.applyScrollableClass()
  }

  private applyScrollableClass(): void {
    const profileCardWrapper = document.querySelector('.profile_card__wrapper')
    if (profileCardWrapper) {
      if (this.pageSize >= 10) {
        this.renderer.addClass(profileCardWrapper, 'scrollable')
      } else {
        this.renderer.removeClass(profileCardWrapper, 'scrollable')
      }
    }
  }


  ngOnDestroy(): void {
    this.paginator.clickPageSize(false)
  }
}
