import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ContactService } from '../../services/contact.service';
import { ToastService } from '../../services/toast.service';
import { AvatarComponent } from '../../components/avatar/avatar.component';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AvatarComponent],
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent implements OnInit {
  private route  = inject(ActivatedRoute);
  private router = inject(Router);
  private svc    = inject(ContactService);
  private toast  = inject(ToastService);

  isEdit    = false;
  contactId = 0;
  loading   = signal(false);
  saving    = signal(false);
  uploading = signal(false);

  form = {
    first_name: '', last_name: '', email: '',
    phone: '', phone2: '', company: '',
    address: '', city: '', country: '',
    notes: '', photo_url: '', is_favorite: false
  };

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.contactId = Number(id);
      this.loading.set(true);
      this.svc.getContact(this.contactId).subscribe({
        next: c => {
          this.form = {
            first_name:  c.first_name,
            last_name:   c.last_name,
            email:       c.email    ?? '',
            phone:       c.phone    ?? '',
            phone2:      c.phone2   ?? '',
            company:     c.company  ?? '',
            address:     c.address  ?? '',
            city:        c.city     ?? '',
            country:     c.country  ?? '',
            notes:       c.notes    ?? '',
            photo_url:   c.photo_url ?? '',
            is_favorite: !!c.is_favorite
          };
          this.loading.set(false);
        },
        error: () => { this.toast.error('No se pudo cargar el contacto'); this.router.navigate(['/']); }
      });
    }
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file  = input.files?.[0];
    if (!file) return;

    this.uploading.set(true);
    this.svc.uploadPhoto(file).subscribe({
      next: res => { this.form.photo_url = res.url; this.uploading.set(false); },
      error: ()  => { this.toast.error('Error al subir la imagen'); this.uploading.set(false); }
    });
  }

  removePhoto() { this.form.photo_url = ''; }

  save() {
    if (!this.form.first_name.trim() || !this.form.last_name.trim()) {
      this.toast.error('Nombre y apellido son obligatorios');
      return;
    }
    this.saving.set(true);

    const obs = this.isEdit
      ? this.svc.updateContact(this.contactId, this.form)
      : this.svc.createContact(this.form);

    obs.subscribe({
      next: c => {
        this.toast.success(this.isEdit ? 'Contacto actualizado' : 'Contacto creado');
        this.router.navigate(['/contacts', c.id]);
      },
      error: err => {
        const msg = err?.error?.error ?? (this.isEdit ? 'Error al actualizar' : 'Error al crear');
        this.toast.error(msg);
        this.saving.set(false);
      }
    });
  }
}
