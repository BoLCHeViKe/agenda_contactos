import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (visible) {
      <div class="overlay fade-in" (click)="onCancel()">
        <div class="dialog fade-up" (click)="$event.stopPropagation()">
          <div class="dialog-icon">🗑️</div>
          <h3>Eliminar contacto</h3>
          <p>¿Seguro que quieres eliminar a <strong>{{ name }}</strong>? Esta acción no se puede deshacer.</p>
          <div class="dialog-actions">
            <button class="btn btn-ghost" (click)="onCancel()">Cancelar</button>
            <button class="btn btn-danger" (click)="onConfirm()">Sí, eliminar</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.65);
      display: flex; align-items: center; justify-content: center;
      z-index: 1000; backdrop-filter: blur(4px);
    }
    .dialog {
      background: var(--bg2); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 32px; max-width: 380px;
      width: 90%; text-align: center; box-shadow: var(--shadow);
    }
    .dialog-icon { font-size: 2.5rem; margin-bottom: 12px; }
    h3 { font-family: var(--font-head); font-size: 1.25rem; margin-bottom: 8px; }
    p { color: var(--text2); font-size: 0.9rem; line-height: 1.6; }
    strong { color: var(--text); }
    .dialog-actions {
      display: flex; gap: 10px; justify-content: center; margin-top: 24px;
    }
    .btn { display:inline-flex; align-items:center; gap:6px; padding:9px 20px;
      border-radius:var(--radius-sm); font-size:0.875rem; font-weight:500; cursor:pointer;
      font-family:var(--font); border:none; transition:all 0.18s ease; }
    .btn-ghost { background:transparent; color:var(--text2); border:1px solid var(--border); }
    .btn-ghost:hover { background:var(--bg3); color:var(--text); }
    .btn-danger { background:transparent; color:var(--danger); border:1px solid var(--danger); }
    .btn-danger:hover { background:var(--danger); color:#fff; }
  `]
})
export class ConfirmDialogComponent {
  @Input() visible = false;
  @Input() name = '';
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onConfirm() { this.confirmed.emit(); }
  onCancel()  { this.cancelled.emit(); }
}
