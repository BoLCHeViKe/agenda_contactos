export interface Contact {
  id: number;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  phone2: string | null;
  company: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  notes: string | null;
  photo_url: string | null;
  is_favorite: number; // 0 | 1
  created_at: string;
  updated_at: string;
}

export interface ContactForm {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  phone2: string;
  company: string;
  address: string;
  city: string;
  country: string;
  notes: string;
  photo_url: string;
  is_favorite: boolean;
}
