import { Trainer } from "./types";

// Placeholder data so the page renders before a real backend is wired in.
export const mockTrainers: Trainer[] = [
  {
    id: "t-1",
    name: "Анна Соколова",
    specialization: "Бег и выносливость",
    experienceYears: 8,
    rating: 4.9,
    reviewsCount: 124,
    pricePerSession: 2500,
    avatarUrl: null,
    tags: ["Марафон", "Техника бега", "План тренировок"],
    isAvailable: true
  },
  {
    id: "t-2",
    name: "Игорь Петров",
    specialization: "Силовые тренировки",
    experienceYears: 12,
    rating: 4.7,
    reviewsCount: 203,
    pricePerSession: 3200,
    avatarUrl: null,
    tags: ["Кроссфит", "Набор массы", "Питание"],
    isAvailable: false
  },
  {
    id: "t-3",
    name: "Мария Иванова",
    specialization: "Йога и растяжка",
    experienceYears: 5,
    rating: 5.0,
    reviewsCount: 87,
    pricePerSession: 2000,
    avatarUrl: null,
    tags: ["Хатха-йога", "Гибкость", "Восстановление"],
    isAvailable: true
  },
  {
    id: "t-4",
    name: "Дмитрий Кузнецов",
    specialization: "Триатлон",
    experienceYears: 10,
    rating: 4.8,
    reviewsCount: 156,
    pricePerSession: 3500,
    avatarUrl: null,
    tags: ["Плавание", "Велоспорт", "Бег"],
    isAvailable: true
  }
];

export const specializations: string[] = [
  "Бег и выносливость",
  "Силовые тренировки",
  "Йога и растяжка",
  "Триатлон"
];
