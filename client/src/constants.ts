import { Service, PaymentMethod, Salon } from './types';

export const MOCK_SALONS: Salon[] = [
  {
    id: 's1',
    name: 'Qurux Hablos',
    description: 'The premier destination for traditional and modern styling.',
    rating: 4.8,
    reviewCount: 124,
    address: 'KM4, Mogadishu',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 's2',
    name: 'Hanna\'s Henna & Spa',
    description: 'Specializing in intricate bridal henna and organic treatments.',
    rating: 4.9,
    reviewCount: 89,
    address: 'Jigjiga Yar, Hargeisa',
    image: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 's3',
    name: 'Golden Glow Salon',
    description: 'Modern aesthetics for the modern woman.',
    rating: 4.5,
    reviewCount: 56,
    address: ' Maka Al Mukarama, Mogadishu',
    image: 'https://images.unsplash.com/photo-1521590832169-d721f543f013?auto=format&fit=crop&q=80&w=800'
  }
];

export const INITIAL_SERVICES: Service[] = [
  {
    id: '1',
    salonId: 's1',
    nameSomali: 'Cilaan Saar',
    nameEnglish: 'Henna Application',
    price: 15,
    category: 'Body',
    durationMin: 60,
    iconName: 'Feather'
  },
  {
    id: '2',
    salonId: 's1',
    nameSomali: 'Mikiyaajka',
    nameEnglish: 'Makeup',
    price: 25,
    category: 'Face',
    durationMin: 45,
    iconName: 'Palette'
  },
  {
    id: '3',
    salonId: 's1',
    nameSomali: 'Timo Dabis',
    nameEnglish: 'Weaving',
    price: 40,
    category: 'Hair',
    durationMin: 120,
    iconName: 'Scissors'
  },
  {
    id: '4',
    salonId: 's2',
    nameSomali: 'Qurxinta Cidiyaha',
    nameEnglish: 'Manicure',
    price: 20,
    category: 'Nails',
    durationMin: 40,
    iconName: 'Sparkles'
  },
  {
    id: '5',
    salonId: 's2',
    nameSomali: 'Timo Qurxin',
    nameEnglish: 'Hair Styling',
    price: 30,
    category: 'Hair',
    durationMin: 60,
    iconName: 'Scissors'
  },
  {
    id: '6',
    salonId: 's3',
    nameSomali: 'Wajiga Dhaqis',
    nameEnglish: 'Face Wash',
    price: 10,
    category: 'Face',
    durationMin: 20,
    iconName: 'Smile'
  },
  {
    id: '7',
    salonId: 's3',
    nameSomali: 'Lashes Extension',
    nameEnglish: 'Lashes Extension',
    price: 35,
    category: 'Face',
    durationMin: 90,
    iconName: 'Eye'
  },
  {
    id: '8',
    salonId: 's3',
    nameSomali: 'Dhaqista Jirka',
    nameEnglish: 'All Body Wash',
    price: 50,
    category: 'Body',
    durationMin: 60,
    iconName: 'Sun'
  }
];

export const PAYMENT_METHODS = [
  { id: PaymentMethod.ZAAD, label: 'Zaad Service', color: 'bg-green-500' },
  { id: PaymentMethod.EVC, label: 'EVC Plus', color: 'bg-blue-600' },
  { id: PaymentMethod.EBIRR, label: 'eBirr / eDahab', color: 'bg-yellow-500' },
  { id: PaymentMethod.CARD, label: 'Credit Card', color: 'bg-rose-500' },
];

export const TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
  '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'
];