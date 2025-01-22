import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  HostListener,
  inject,
  input, OnDestroy,
  OnInit,
  Renderer2
} from '@angular/core'
import {Subject, takeUntil} from 'rxjs';
import {MatDatepicker} from '@angular/material/datepicker';
import moment from 'moment';


@Directive({
  selector: '[datePickerFieldDirective]',
  standalone: true
})
export class DatePickerFieldDirective implements OnInit, OnDestroy {
  datepicker = input<MatDatepicker<any> | null>(null)
  private readonly el = inject(ElementRef)
  private readonly renderer = inject(Renderer2)
  private readonly cdr = inject(ChangeDetectorRef)
  private readonly destroy$ = new Subject<void>()
  private hasBeenEmpty = false // Tracks if the input was ever left empty
  private isFocused = false // Tracks if the field is focused
  private isInitialFocus = true // Tracks the initial focus interaction


  ngOnInit() {
    const datepicker = this.datepicker()
    if (datepicker) {
      datepicker.closedStream
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          const value = this.el.nativeElement.value.trim()
          const color = value === '' ? 'var(--orange-input)' : 'var(--light-color)'
          this.updateColors(color)
          this.cdr.markForCheck()
        })
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  @HostListener('focus') onFocus() {
    this.isFocused = true
    const value = this.el.nativeElement.value.trim()
    const color = value === ''
      ? (this.isInitialFocus ? 'var(--pink-input)' : 'var(--orange-input)')
      : this.isValidDate(value)
        ? 'var(--pink-input)'
        : 'var(--orange-input)'
    this.updateColors(color)
  }

  @HostListener('blur') onBlur() {
    setTimeout(() => {
      if (this.el.nativeElement === document.activeElement) {
        return
      }
      this.isFocused = false
      this.isInitialFocus = false

      const value = this.el.nativeElement.value.trim()
      const color = value === '' ? 'var(--orange-input)' : this.isValidDate(value) ? 'var(--light-color)' : 'var(--orange-input)'
      this.hasBeenEmpty = value === ''
      this.updateColors(color)
    }, 200)
  }

  @HostListener('input') onInput() {
    const value = this.el.nativeElement.value.trim()
    const color = this.isInitialFocus
      ? 'var(--pink-input)'
      : value === ''
        ? 'var(--orange-input)'
        : this.isValidDate(value)
          ? 'var(--pink-input)'
          : 'var(--orange-input)'
    this.hasBeenEmpty = value === ''
    this.updateColors(color)
  }

  private isValidDate(value: string): boolean {
    const formats = [
      'DD/MM/YY', 'DD/MM/YYYY', 'D/M/YY', 'D/M/YYYY',
      'DD-MM-YY', 'DD-MM-YYYY', 'D-M-YY', 'D-M-YYYY',
      'DD.MM.YY', 'DD.MM.YYYY', 'D.M.YY', 'D.M.YYYY',
      'MM/DD/YY', 'MM/DD/YYYY', 'M/D/YY', 'M/D/YYYY',
      'MM-DD-YY', 'MM-DD-YYYY', 'M-D-YY', 'M-D-YYYY',
      'MM.DD.YY', 'MM.DD.YYYY', 'M.D.YY', 'M.D.YYYY',
      'YYYY-MM-DD', 'YYYY/MM/DD', 'YYYY.MM.DD',
      'YYYY-M-D', 'YYYY/M/D', 'YYYY.M.D',
      'YYYY-M-DD', 'YYYY/M/DD', 'YYYY.M.DD',
      'YYYY-MM-D', 'YYYY/MM/D', 'YYYY.MM.D',
      'YY-MM-DD', 'YY/MM/DD', 'YY.MM.DD',
      'YY-MM-D', 'YY/MM/D', 'YY.MM.D',
      'YY-M-DD', 'YY/M/DD', 'YY.M.DD',
      'YY-M-D', 'YY/M/D', 'YY.M.D',
    ];
    return moment(value, formats, true).isValid()
  }

  private updateColors(color: string) {
    this.renderer.setStyle(this.el.nativeElement, 'borderBottom', `1px solid ${color}`)
  }
}

