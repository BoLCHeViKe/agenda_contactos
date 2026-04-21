import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../services/contact.service';
import { ToastService } from '../../services/toast.service';
import { AvatarComponent } from '../../components/avatar/avatar.component';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { Contact } from '../../models/contact.model';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, AvatarComponent, ConfirmDialogComponent],
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {
  private svc   = inject(ContactService);
  private toast = inject(ToastService);

  contacts     = signal<Contact[]>([]);
  loading      = signal(true);
  search       = signal('');
  onlyFavs     = signal(false);
  deleteTarget = signal<Contact | null>(null);
  searchInput  = '';

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.svc.getContacts(this.search(), this.onlyFavs()).subscribe({
      next: data => { this.contacts.set(data); this.loading.set(false); },
      error: ()  => { this.toast.error('Error al cargar contactos'); this.loading.set(false); }
    });
  }

  onSearch() { this.search.set(this.searchInput); this.load(); }

  clearSearch() { this.searchInput = ""; this.search.set(""); this.load(); }

  onInputChange() { if (!this.searchInput) { this.search.set(""); this.load(); } }

  setOnlyFavs(val: boolean) { this.onlyFavs.set(val); this.load(); }

  toggleFavorite(c: Contact, event: Event) {
    event.stopPropagation(); event.preventDefault();
    this.svc.toggleFavorite(c.id).subscribe({
      next: updated => this.contacts.update(list => list.map(x => x.id === updated.id ? updated : x)),
      error: () => this.toast.error('Error al actualizar favorito')
    });
  }

  confirmDelete(c: Contact, event: Event) {
    event.stopPropagation(); event.preventDefault();
    this.deleteTarget.set(c);
  }

  doDelete() {
    const c = this.deleteTarget();
    if (!c) return;
    this.svc.deleteContact(c.id).subscribe({
      next: () => {
        this.contacts.update(list => list.filter(x => x.id !== c.id));
        this.toast.success(c.first_name + ' ' + c.last_name + ' eliminado');
        this.deleteTarget.set(null);
      },
      error: () => this.toast.error('Error al eliminar el contacto')
    });
  }

  cancelDelete() { this.deleteTarget.set(null); }

  getPhotoUrl(url: string | null): string { return url || ''; }
  isFavorite(c: Contact): boolean { return !!c.is_favorite; }

  get totalCount(): number { return this.contacts().length; }
  get favCount(): number { return this.contacts().filter(c => !!c.is_favorite).length; }
  get deleteTargetName(): string {
    const c = this.deleteTarget();
    return c ? c.first_name + ' ' + c.last_name : '';
  }
  get showConfirm(): boolean { return !!this.deleteTarget(); }
  get pageTitle(): string { return this.onlyFavs() ? 'Favoritos' : 'Contactos'; }
  get isLoading(): boolean { return this.loading(); }
  get isOnlyFavs(): boolean { return this.onlyFavs(); }
  get hasSearch(): boolean { return !!this.searchInput; }
  get isEmpty(): boolean { return !this.loading() && this.contacts().length === 0; }
  get hasContacts(): boolean { return !this.loading() && this.contacts().length > 0; }
  get currentSearch(): string { return this.search(); }

  grouped(): { letter: string; contacts: Contact[] }[] {
    const sorted = [...this.contacts()].sort((a, b) =>
      (a.last_name + a.first_name).localeCompare(b.last_name + b.first_name, 'es')
    );
    const map = new Map<string, Contact[]>();
    for (const c of sorted) {
      const letter = (c.last_name?.[0] ?? c.first_name?.[0] ?? '#').toUpperCase();
      if (!map.has(letter)) map.set(letter, []);
      map.get(letter)!.push(c);
    }
    return Array.from(map.entries()).map(([letter, contacts]) => ({ letter, contacts }));
  }
}
