import { HttpClient, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { environment } from '../../environments/environment';
import { SnackbarStore } from '../snack-bar/stack-store';
import { imageUploadHttpError } from './utils';
import { PassportData, UploadResponse } from './model';
import { catchError, firstValueFrom, of } from 'rxjs';


@UntilDestroy()
@Injectable({ providedIn: 'root' })
export class ServerService {
  private readonly _snackStore = inject(SnackbarStore)
  private readonly http = inject(HttpClient)
  private readonly url = environment.apiUrl

  public uploadPassportsOnServer(
    formData: FormData,
    onProgress: (progress: number) => void
  ): Promise<UploadResponse> {
    return new Promise((resolve, reject) => {
      this.http
        .post(`${this.url}fetch_passport_data`, formData, {
          reportProgress: true,
          observe: 'events',
        })
        .pipe(untilDestroyed(this))
        .subscribe({
          next: (event) => {
            if (event.type === HttpEventType.UploadProgress && event.total) {
              const progress = Math.round((event.loaded / event.total) * 100)
              onProgress(progress)
            } else if (event.type === HttpEventType.Response) {
              this._snackStore.openSnackBar('Загрузка завершена', 'success')
              resolve(event.body as UploadResponse)
            }
          },
          error: (error: HttpErrorResponse) => {
            const { message, type } = imageUploadHttpError(error)
            this._snackStore.openSnackBar(message, type, type === 'warning' ? 'report' : undefined)
            reject(new Error(message))
          }
        })
    })
  }

  public translatePassports(passports: PassportData[]): Promise<PassportData[]> {
    const endpoint = `${this.url}translate_passport_data`
    return firstValueFrom(
      this.http.post<PassportData[]>(endpoint, passports)
    )
  }

  public generateDocs(data: { data: PassportData[]; dataUkr: PassportData[] }): Promise<any> {
    const endpoint = `${this.url}docx_creation`
    return firstValueFrom(
      this.http.post(endpoint, data)
    )
  }


}
