import { Injectable, signal, Signal } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { MatExpansionPanel } from '@angular/material/expansion';


@Injectable({ providedIn: 'root' })
export class SidebarStateService {
  private drawerRef = signal<MatDrawer | null>(null)
  private expansionPanelRef = signal<MatExpansionPanel | null>(null)

  public get drawer(): Signal<MatDrawer | null> {
    return this.drawerRef
  }

  public get expansionPanel(): Signal<MatExpansionPanel | null> {
    return this.expansionPanelRef
  }

  setDrawer(drawer: MatDrawer): void {
    this.drawerRef.set(drawer)
  }

  setExpansionPanel(expansionPanel: MatExpansionPanel): void {
    this.expansionPanelRef.set(expansionPanel)
  }
}
