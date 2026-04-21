import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ContactService } from '../../services/contact.service';
import { ToastService } from '../../services/toast.service';
import { AvatarComponent } from '../../components/avatar/avatar.component';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { Contact } from '../../models/contact.model';

@Component({
  selector: 'app-contact-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, AvatarComponent, ConfirmDialogComponent],
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.css']
})
export class ContactDetailComponent implements OnInit {
  private route  = inject(ActivatedRoute);
  private router = inject(Router);
  private svc    = inject(ContactService);
  private toast  = inject(ToastService);

  contact = signal<Contact | null>(null);
  loading = signal(true);
  showDel = signal(false);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.svc.getContact(id).subscribe({
      next: c  => { this.contact.set(c); this.loading.set(false); },
      error: () => { this.toast.error('Contacto no encontrado'); this.router.navigate(['/']); }
    });
  }

  isLoading(): boolean { return this.loading(); }

  toggleFavorite() {
    const c = this.contact();
    if (!c) return;
    this.svc.toggleFavorite(c.id).subscribe({
      next: updated => this.contact.set(updated),
      error: () => this.toast.error('Error al actualizar favorito')
    });
  }

  doDelete() {
    const c = this.contact();
    if (!c) return;
    this.svc.deleteContact(c.id).subscribe({
      next: () => {
        this.toast.success(c.first_name + ' ' + c.last_name + ' eliminado');
        this.router.navigate(['/']);
      },
      error: () => this.toast.error('Error al eliminar el contacto')
    });
  }

  getPhotoUrl(url: string | null): string { return url || ''; }

  getLocation(c: Contact): string {
    return [c.city, c.country].filter(v => !!v).join(', ');
  }

  get contactName(): string {
    const c = this.contact();
    return c ? c.first_name + ' ' + c.last_name : '';
  }

  formatDate(d: string): string {
    return new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
  }
}
