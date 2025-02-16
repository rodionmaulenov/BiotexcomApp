import { patchState, signalStore, withState, withMethods } from '@ngrx/signals';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from './snack-bar.component';

export const SnackbarStore = signalStore(
  { providedIn: 'root' }, 
  withState({
    message: '',
    icon: '',
    duration: 3000,
    horizontalPosition: 'center' as 'start' | 'center' | 'end' | 'left' | 'right',
    verticalPosition: 'top' as 'top' | 'bottom',
    panelClass: '' as string | string[],
    show: false, 
  }),
  withMethods((store, _snackBar = inject(MatSnackBar)) => ({
    openSnackBar(
      message: string, 
      type: 'success' | 'error' | 'warning' | 'info' = 'info',
      icon?: string,
      duration?: number, 
    ) {
      const panelClass = `snackbar-${type}`
      patchState(store, { 
        message,
        icon: icon || '', 
        show: true,
        duration: duration ?? store.duration(),
        panelClass
      })

      if (icon) {
        // Use the CustomSnackbarComponent if an icon is provided
        _snackBar.openFromComponent(SnackBarComponent, {
          data: {
            message,
            icon,
          },
          duration: store.duration(),
          horizontalPosition: store.horizontalPosition(),
          verticalPosition: store.verticalPosition(),
          panelClass: [panelClass],
        })
      } else {
        // Use default MatSnackBar for simple snackbars
        _snackBar.open(message, '', {
          duration: store.duration(),
          horizontalPosition: store.horizontalPosition(),
          verticalPosition: store.verticalPosition(),
          panelClass: [panelClass],
        })
      }
    },
  }))
)

