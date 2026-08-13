import { generateScheduleFromConfig } from './utils';

export const ADMIN_PASSWORD = 'baratavelha0325A$';

export const DEFAULT_WORK_CONFIG = {
  daysOfWeek: [1, 2, 3, 4, 5],
  startTime: "08:00",
  endTime: "18:00",
  slotDuration: 30,
  minInterval: 5,
  breaks: {
    lunch: { start: "12:00", end: "13:30", active: true },
    snack: { start: "16:00", end: "16:30", active: true }
  }
};

export const INITIAL_DOCTORS = [
  {
    id: "1",
    name: "Dra. Beatriz Menezes",
    email: "beatriz.menezes@medagendar.com",
    crm: "SP-123456",
    isClinic: true,
    specialties: ["Dermatologia", "Estética"],
    rating: 4.9,
    reviews: 156,
    location: "São Paulo, SP",
    city: "São Paulo",
    state: "SP",
    street: "Paulista",
    number: "1000",
    neighborhood: "Jardins",
    cep: "01310-100",
    clinicAddress: "Av. Paulista, Nº 1000, Jardins - São Paulo/SP - CEP: 01310-100",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400",
    bio: "Especialista em estética facial e tratamentos rejuvenescimento.",
    price: 450,
    schedule: generateScheduleFromConfig(DEFAULT_WORK_CONFIG),
    workConfig: DEFAULT_WORK_CONFIG,
    accessCode: "12345",
    clinics: ["Clínica Paulista", "Centro Médico Jardins"],
    createdAt: "2024-01-15T10:00:00.000Z",
    paymentStatus: "paid",
    status: "active"
  }
];

export const SPECIALTIES = ["Cardiologia", "Dermatologia", "Pediatria", "Ortopedia", "Ginecologia", "Psiquiatria", "Oftalmologia", "Neurologia", "Endocrinologia", "Estética", "Medicina Esportiva"];
