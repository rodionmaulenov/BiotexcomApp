import {HttpClient, HttpEventType} from '@angular/common/http';
import {inject, Injectable, signal, WritableSignal} from '@angular/core';
import {environment} from '../../../environments/environment';
import {untilDestroyed} from '@ngneat/until-destroy';


@Injectable({providedIn: 'root'})
export class ServerService {
  private readonly http = inject(HttpClient)
  private readonly url = environment.apiUrl
  public isLoaded = signal<boolean>(false)

  public uploadPassportsOnServer(
    selectedFiles: WritableSignal<{ file: File; progress: number }[]>
    , formData: FormData
  ): void {

    this.http.post(`${this.url}fill_invitation/fetch_passport_data`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(untilDestroyed(this))
      .subscribe({
        next: (event) => {
          // tracking progress
          if (event.type === HttpEventType.UploadProgress && event.total) {
            const progress = Math.round((event.loaded / event.total) * 100)

            // Update progress for each file
            selectedFiles.update(files =>
              files.map(f => ({...f, progress}))
            )
          }
        },
        error: (err) => {
          console.error('Ошибка загрузки:', err)
        },
        complete: () => {
          this.isLoaded.set(true)
          console.log('Файл успешно загружен!')
        }
      })
  }

}
