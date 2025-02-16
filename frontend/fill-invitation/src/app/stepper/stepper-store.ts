import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { StepState } from './model';

export const StepperStore = signalStore(
   { providedIn: 'root' },

   withState({
      steps: [
         { label: 'Изъятие паспортных данных' },
         { label: 'Перевод на украинский язык' },
         { label: 'Генерация документа' },
      ] as StepState[],

      selectedIndex: 0,
   }),

   withMethods((store) => ({
      changeStep(index: number) {
         patchState(store, {selectedIndex: index})
      }

   }))
)

