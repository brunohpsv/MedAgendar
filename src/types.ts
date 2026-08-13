export interface BreakConfig {
  start: string;
  end: string;
  active: boolean;
}

export interface WorkConfig {
  daysOfWeek: number[];
  startTime: string;
  endTime: string;
  slotDuration: number;
  minInterval: number;
  breaks: {
    lunch: BreakConfig;
    snack: BreakConfig;
  };
}

export interface Doctor {
  id: string;
  name: string;
  email: string;
  crm: string;
  isClinic: boolean;
  specialties: string[];
  rating: number;
  reviews: number;
  location: string;
  city: string;
  state: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  cep?: string;
  clinicAddress?: string;
  image: string;
  bio: string;
  price: number;
  schedule: any[];
  workConfig: WorkConfig;
  accessCode: string;
  clinics?: string[];
  createdAt: string;
  paymentStatus: string;
  status: string;
  onlineConsultation?: boolean;
  additionalFeatures?: string;
  address?: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  patientName: string;
  patientPhone: string;
  patientCPF: string;
  date: string;
  time: string;
  status: 'confirmed' | 'cancelled';
}
