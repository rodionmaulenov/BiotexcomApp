import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";

export const DateStore = signalStore(
   { providedIn: 'root' },

   withState({
      numberInvitatin: 0,
      numberDate: new Date(),
      startDate: new Date(),
      endDate: new Date(),
   }),

   withMethods((store) => {
      return {
         setDate(type: 'numberDate' | 'startDate' | 'endDate', date: Date) {
            patchState(store, { [type]: date.toISOString() })
         }
      }
   })
) 