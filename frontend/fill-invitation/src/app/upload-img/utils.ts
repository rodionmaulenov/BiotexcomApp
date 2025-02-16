import { HttpErrorResponse } from '@angular/common/http';


export function imageUploadHttpError(error: HttpErrorResponse): { message: string; type: 'error' | 'warning' } {
  if (error.error?.error?.images?.[0]) {
    console.log('error.error.error.images:', error.error.error.images[0])
    return { message: error.error.error.images[0], type: 'warning' }
  }
  
  if (error.error instanceof ErrorEvent) {
    console.log(`Client-side error ${error.error}`)
    return { message: 'Client-side error', type: 'error' }
  }
  console.log(`Unexpected error occurred ${error.error.error}`)
  return { message: 'Unexpected error occurred', type: 'error' }
}


