// import {
//   patchState, signalState,
//   signalStore,
//   withComputed,
//   withMethods,
//   withState,
// } from '@ngrx/signals';
// import {rxMethod} from '@ngrx/signals/rxjs-interop';
// import {inject, computed} from '@angular/core';
// import {HttpClient, HttpEventType, HttpEvent} from '@angular/common/http';
// import {of, pipe} from 'rxjs';
// import {switchMap, tap, finalize} from 'rxjs/operators';
// import {environment} from '../../../../environments/environment';
//
// // Define the shape of the state
// type FileUploadState = {
//   selectedFiles: { file: File; progress: number }[];
//   uploading: boolean;
//   defaultImage: string;
// }
//
// const initialState: FileUploadState = {
//   selectedFiles: [],
//   uploading: false,
//   defaultImage: '/assets/image.png',
// }
//
// export const FileUploadStore = signalStore(
//   {providedIn: 'root'},
//   withState(initialState),
//   withMethods((store, http = inject(HttpClient), apiUrl = environment.apiUrl) => ({
//
//       selectFiles(files: FileList) {
//
//         // Calculate the new files to add
//         const newFiles = Array.from(files)
//           .filter(
//             (file) =>
//               !store.some(
//                 (existing: { file: File; progress: number }) => existing.file.name === file.name
//               )
//           )
//           .map((file) => ({file, progress: 0}));
//
//         // Update the state with the new files
//         patchState(selectedFilesSignal, (currentFiles) => [
//           ...currentFiles,
//           ...newFiles,
//         ]);
//       },
//
//     }),
//   )
// )
// // withMethods((store) => {
// //   const http = inject(HttpClient);
// //   const apiUrl = environment.apiUrl;
// //
// //   return {
// //     selectFiles(files: FileList) {
// //       const newFiles = Array.from(files)
// //         .filter(
// //           (file) => !store.selectedFiles().some((existing) => existing.file.name === file.name)
// //         )
// //         .map((file) => ({file, progress: 0}));
// //
// //       patchState(store, {
// //         selectedFiles: [...store.selectedFiles(), ...newFiles],
// //       });
// //     },
// //
// //     removeFile(fileToRemove: File) {
// //       patchState(store, {
// //         selectedFiles: store.selectedFiles().filter(({file}) => file !== fileToRemove),
// //       });
// //     },
// //
// //     uploadFiles: rxMethod<void>(
// //       pipe(
// //         switchMap(() => {
// //           if (!store.selectedFiles().length) {
// //             return of(); // Ensure it always returns an observable
// //           }
// //
// //           const formData = new FormData();
// //           store.selectedFiles().forEach(({file}) => formData.append('files', file));
// //           patchState(store, {uploading: true});
// //
// //           return http.post<HttpEvent<any>>(`${apiUrl}fill_invitation/fetch_passport_data`, formData, {
// //             reportProgress: true,
// //             observe: 'events',
// //           }).pipe(
// //             tap((event) => {
// //               if (event.type === HttpEventType.UploadProgress && event.total) {
// //                 const progress = Math.round((event.loaded / event.total) * 100);
// //                 patchState(store, {
// //                   selectedFiles: store.selectedFiles().map((f) => ({
// //                     ...f,
// //                     progress,
// //                   })),
// //                 });
// //               }
// //             }),
// //             finalize(() => {
// //               patchState(store, {uploading: false});
// //               console.log('Файл успешно загружен!');
// //             })
// //           );
// //         })
// //       )
// //     ),
// //   };
// // }),
// // withComputed((store) => ({
// //   isUploadDisabled: computed(() => store.uploading() || store.selectedFiles().length === 0),
// // }))


// upload.store.ts
import {signalStore, withState, withMethods, patchState} from '@ngrx/signals';
import {HttpClient, HttpEventType} from '@angular/common/http';
import {inject} from '@angular/core';


// export interface UploadFile {
//   file: File;
//   progress: number;
// }
//
// export interface UploadState {
//   selectedFiles: UploadFile[];
//   isLoading: boolean;
// }
//
// export const initialUploadState: UploadState = {
//   selectedFiles: [],
//   isLoading: false,
// };

export const UploadStore = signalStore(
  {providedIn: 'root'},
  withState({
    selectedFiles: [] as { file: File, progress: number },
    uploading: false,
    defaultImage: '/assets/image.png',
  }),
  withMethods(store => {
      const {basket, from, to, initialized} = state

      return {
        updateCriteria: (from: string, to: string) => {
          patchState(state, {from, to});
        },
      }
    }
  ),
)

export const FlightBookingStore = signalStore(
  {providedIn: 'root'},
  withState({
    from: 'Paris',
    to: 'London',
    initialized: false,
    basket: {} as Record<number, boolean>,
  }),
  withMethods(store => {
      const {basket, from, to, initialized} = state

      return {
        updateCriteria: (from: string, to: string) => {
          patchState(state, {from, to});
        },
      }
    }
  ),
)
