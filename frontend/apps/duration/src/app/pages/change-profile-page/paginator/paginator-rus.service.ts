import { MatPaginatorIntl } from '@angular/material/paginator';


export function russianPaginatorIntl() {
  const paginatorIntl = new MatPaginatorIntl()

  paginatorIntl.itemsPerPageLabel = 'Элементов на странице:'
  paginatorIntl.nextPageLabel = 'Следующая страница'
  paginatorIntl.previousPageLabel = 'Предыдущая страница'
  paginatorIntl.firstPageLabel = 'Первая страница'
  paginatorIntl.lastPageLabel = 'Последняя страница'

  paginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return `0 из ${length}`
    }

    const startIndex = page * pageSize + 1
    const endIndex = Math.min((page + 1) * pageSize, length)

    return `${startIndex} – ${endIndex} из ${length}`
  }

  return paginatorIntl
}
