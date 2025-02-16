import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { UploadIMGStore } from '../../../upload-img/upl-img-store';
import { StepperStore } from '../../stepper-store';
import { PassportData } from '../../../upload-img/model';

@Component({
  selector: 'extr-passp-tbl',
  imports: [
    FormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  standalone: true,
  templateUrl: './extr-passp-tbl.component.html',
  styleUrl: './extr-passp-tbl.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExtrPasspTblComponent {
  protected readonly _store = inject(UploadIMGStore)
  protected readonly _stepStore = inject(StepperStore)
  protected readonly displayedColumns: string[] = [
    'surname', 'name', 'father_name', 'passport_number', 'date_of_birth', 'date_of_issue'
  ]

  passportData(): PassportData[] {
    const index = this._stepStore.selectedIndex()
    if (index === 0) {
      return this._store.responseBody()
    } else if (index === 1) {
      return this._store.responseBodyUkr()
    } else {
      return []
    }
  }


}




