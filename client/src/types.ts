export enum Role {
  CUSTOMER = 'CUSTOMER',
  MANAGER = 'MANAGER',
  GUEST = 'GUEST'
}

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  role: Role;
  avatar?: string;
}

export interface Salon {
  id: string;
  name: string;
  description: string;
  rating: number;
  reviewCount: number;
  image: string;
  images?: string[];
  address: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    twitter?: string;
  };
  ownerId?: string;
  phoneNumber?: string;
}

export interface Service {
  id: string;
  salonId: string; // Linked to a specific salon
  nameSomali: string;
  nameEnglish: string;
  price: number;
  category: 'Hair' | 'Face' | 'Body' | 'Nails';
  durationMin: number;
  iconName: string;
}

export interface Booking {
  id: string;
  serviceId: string;
  salonId: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  date: Date;
  timeSlot: string | string[]; // Can now be multiple
  paymentMethod: PaymentMethod;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Declined' | 'Cancelled';
  totalPrice: number;
}

export enum PaymentMethod {
  ZAAD = 'Zaad Service',
  EVC = 'EVC Plus',
  EBIRR = 'e-Dahab/eBirr',
  CARD = 'Credit Card'
}

export interface Stats {
  totalRevenue: number;
  totalBookings: number;
  popularServiceId: string;
}

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}