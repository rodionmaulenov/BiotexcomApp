import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  input,
  Renderer2
} from '@angular/core'
import {MatIcon} from '@angular/material/icon'


@Directive({
  selector: '[appFocusInteraction]',
  standalone: true
})
export class FocusInteractionDirective {
  syncTarget = input<MatIcon | null>(null)
  private readonly el = inject(ElementRef)
  private readonly renderer = inject(Renderer2)
  private hasBeenEmpty = false // Tracks if the input was ever left empty
  private isFocused = false // Tracks if the field is focused
  private isInitialFocus = true // Tracks the initial focus interaction// Accept reference to the date picker


  @HostListener('focus') onFocus() {
    console.log('focus')
    this.isFocused = true

    // Check the current value of the input field
    const value = this.el.nativeElement.value.trim()

    // Determine the color based on the input's value
    const color = value === ''
      ? (this.isInitialFocus ? 'var(--pink-input)' : 'var(--orange-input)')
      : 'var(--pink-input)' // Always pink if the input is not empty

    this.updateColors(color)
  }

  @HostListener('blur') onBlur() {
    setTimeout(() => {
      if (this.el.nativeElement === document.activeElement) {
        return // The input field is still focused, skip blur logic
      }
      this.isFocused = false
      this.isInitialFocus = false // Reset the initial focus flag after blur

      const value = this.el.nativeElement.value.trim()
      const color = value === '' ? 'var(--orange-input)' : 'var(--light-color)'
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
        : 'var(--pink-input)'
    this.hasBeenEmpty = value === ''
    this.updateColors(color)
  }

  @HostListener('mouseenter') onMouseEnter() {
    if (!this.isFocused && this.hasBeenEmpty) {
      this.updateColors('var(--light-color)')
    }
  }

  @HostListener('mouseleave') onMouseLeave() {
    if (!this.isFocused && this.hasBeenEmpty) {
      this.updateColors('var(--orange-input)')
    }
  }

  private updateColors(color: string) {
    // Update the border color of the input
    this.renderer.setStyle(this.el.nativeElement, 'borderBottom', `1px solid ${color}`)

    // Update the color of the icon if it exists
    const targetElement = this.syncTarget()
    if (targetElement && '_elementRef' in targetElement) {
      const iconElement = targetElement._elementRef.nativeElement
      this.renderer.setStyle(iconElement, 'color', color)
    }
  }
}


