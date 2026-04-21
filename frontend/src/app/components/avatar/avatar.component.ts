import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="avatar" [style.width.px]="size" [style.height.px]="size" [style.font-size.px]="size * 0.4">
      @if (photoUrl) {
        <img [src]="photoUrl" [alt]="initials" (error)="onError()">
      } @else {
        <span>{{ initials }}</span>
      }
    </div>
  `,
  styles: [`
    .avatar {
      border-radius: 50%;
      background: linear-gradient(135deg, var(--accent) 0%, #6366f1 100%);
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; color: #fff; font-family: var(--font-head);
      overflow: hidden; flex-shrink: 0;
      box-shadow: 0 0 0 2px var(--bg3), 0 0 0 4px var(--border);
    }
    img { width: 100%; height: 100%; object-fit: cover; display: block; }
  `]
})
export class AvatarComponent {
  @Input() firstName = '';
  @Input() lastName = '';
  @Input() photoUrl: string | null = null;
  @Input() size = 48;

  get initials(): string {
    return ((this.firstName?.[0] ?? '') + (this.lastName?.[0] ?? '')).toUpperCase() || '?';
  }

  onError() { this.photoUrl = null; }
}
