import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { of, switchMap } from 'rxjs';
import { FileUpload, PassportData, UploadResponse } from './model';
import { ServerService } from './service';
import { SnackbarStore } from '../snack-bar/stack-store';


export const UploadIMGStore = signalStore(

  { providedIn: 'root' },

  withState({
    selectedFiles: [] as FileUpload[],
    loading: false,
    inProgress: false,
    defaultIMG: '/assets/image.png',
    responseBody: [] as PassportData[],
    responseBodyUkr: [] as PassportData[]
  }),

  withMethods((store, service = inject(ServerService), _snackStore = inject(SnackbarStore)) => {
    return {
      onUpload: rxMethod<void>(
        switchMap(() => {
          patchState(store, { inProgress: true })
          patchState(store, { loading: true })

          const files = store.selectedFiles()
          if (!files.length) return of(null)

          const formData = new FormData()
          files.forEach(({ file }) => formData.append('images', file))

          return service
            .uploadPassportsOnServer(formData, (progress) => {
              patchState(store, {
                selectedFiles: store.selectedFiles().map((f) => ({
                  ...f,
                  progress,
                })),
              })
            })
            .then((response: UploadResponse) => {
              patchState(store, { responseBody: response.passports })
              patchState(store, { loading: false })
            },
              (error) => {
                patchState(store, { selectedFiles: [] })
                patchState(store, { loading: false })
              }
            )
        })
      ),

      async translatePassports() {
        patchState(store, { loading: true })
        const responseBody = store.responseBody()
        if (!responseBody.length) return

        try {
          const translatedPassports = await service.translatePassports(responseBody)
          patchState(store, { responseBodyUkr: translatedPassports })
          patchState(store, { loading: false })
          _snackStore.openSnackBar('Перевод успешно завершен', 'success')
        }
        catch (error) {
          _snackStore.openSnackBar('Ошибка перевода данных на сервере', 'error')
          console.error('Translation error:', error)
        }
      },

      async generateDocx() {
        const {responseBody, responseBodyUkr} = store

        const combinedData = {
          data: responseBody(),
          dataUkr: responseBodyUkr()
        }

        if (combinedData.data.length == 0 || combinedData.dataUkr.length == 0) {
          _snackStore.openSnackBar('Данные пусты', 'warning')
          return 
        }

        patchState(store, {loading: true})
        
        try {
          const docx = service.generateDocs(combinedData)
          patchState(store, { loading: false })
          _snackStore.openSnackBar('Документ успешно сгенерирован', 'success')
        } catch (error) {
          patchState(store, { loading: false })
          _snackStore.openSnackBar('Ошибка обработки данных на сервере', 'error')
          console.error('Error posting combined data:', error)
        }
      },

      onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement
        if (!input.files) return

        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg']

        const newFiles = Array.from(input.files)
          .filter(file => {
            if (!allowedTypes.includes(file.type)) {
              return false
            }
            return !store.selectedFiles().some(existing => existing.file.name === file.name)
          })
          .map((file) => ({ file, progress: 0 }))
        patchState(store, {
          selectedFiles: [...store.selectedFiles(), ...newFiles],
        })

        // Reset the input value to allow re-selection of the same file
        input.value = ''
      },

      removeFile(fileToRemove: File) {
        patchState(store, {
          selectedFiles: store
            .selectedFiles()
            .filter(({ file }) => file !== fileToRemove),
        })
      },

      updatePassportData(updatedPassport: PassportData) {
        patchState(store, {
          responseBody: store.responseBody().map((passport) =>
            passport.id === updatedPassport.id ? updatedPassport : passport
          ),
        })
      },
    }
  })
)
