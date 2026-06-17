import { Trainer } from "./types";

// Placeholder data modelled on the real page. Sub-scores are 0–10 per component.
export const mockTrainers: Trainer[] = [
  {
    id: "t-1",
    name: "Юрий Строфилов",
    handle: "Stro_team (Дежурный тренер)",
    avatarUrl: null,
    overallScore: 9.1,
    components: {
      studentProgress: 9.4,
      trainerScore: 9.0,
      experience: 9.8,
      communication: 8.6,
      achievements: 9.5,
      activity: 8.2
    },
    disciplines: ["run"],
    description:
      "Чемпион мира по марафону в возрастной группе 55+, руководит командой Дежурного тренера. Задача ДТ — добиться долгосрочного роста результата.",
    price: 5000,
    priceFrom: false,
    currency: "RUB",
    remote: true,
    tags: ["Марафон", "Команда", "Долгосрочный план"]
  },
  {
    id: "t-2",
    name: "Дмитрий Познышев",
    handle: null,
    avatarUrl: null,
    overallScore: 8.4,
    components: {
      studentProgress: 8.7,
      trainerScore: 8.5,
      experience: 7.9,
      communication: 9.1,
      achievements: 7.6,
      activity: 8.8
    },
    disciplines: ["run", "bike"],
    description:
      "Онлайн-тренер по бегу для новичков и любителей. Подойдёт, если хотите начать бегать, вернуться после паузы или травмы.",
    price: 10000,
    priceFrom: false,
    currency: "RUB",
    remote: true,
    tags: ["Новичкам", "Возвращение после травмы"]
  },
  {
    id: "t-3",
    name: "Пётр Шибанов",
    handle: null,
    avatarUrl: null,
    overallScore: 8.0,
    components: {
      studentProgress: 7.8,
      trainerScore: 8.2,
      experience: 8.0,
      communication: 9.4,
      achievements: 7.2,
      activity: 7.9
    },
    disciplines: ["run"],
    description:
      "Хотите общаться с Человеком? Ищете ответы, варианты, помощь, поддержку? Желаете быть услышанным в откровенном диалоге?",
    price: 6000,
    priceFrom: false,
    currency: "RUB",
    remote: true,
    tags: ["Поддержка", "Диалог"]
  },
  {
    id: "t-4",
    name: "Юрий Чернополечий",
    handle: null,
    avatarUrl: null,
    overallScore: 8.8,
    components: {
      studentProgress: 9.2,
      trainerScore: 8.9,
      experience: 8.4,
      communication: 8.7,
      achievements: 8.1,
      activity: 9.0
    },
    disciplines: ["run", "bike", "swim"],
    description:
      "Помогаю взрослым осознанным людям превратить бег из хаотичного хобби в управляемую систему. Готовлю вас к финишу.",
    price: 7000,
    priceFrom: false,
    currency: "RUB",
    remote: true,
    tags: ["Система", "Триатлон", "Подготовка к старту"]
  },
  {
    id: "t-5",
    name: "Андрей Елизарьев",
    handle: null,
    avatarUrl: null,
    overallScore: 7.9,
    components: {
      studentProgress: 8.0,
      trainerScore: 7.7,
      experience: 7.5,
      communication: 8.3,
      achievements: 8.6,
      activity: 7.4
    },
    disciplines: ["run"],
    description:
      "Тренер, который научит вас бегать в кайф! С детства активно занимаюсь спортом: бег, спортивное ориентирование, лыжные гонки.",
    price: 5000,
    priceFrom: false,
    currency: "RUB",
    remote: true,
    tags: ["В удовольствие", "Любителям"]
  },
  {
    id: "t-6",
    name: "Анастасия Шелковина",
    handle: null,
    avatarUrl: null,
    overallScore: 8.2,
    components: {
      studentProgress: 8.5,
      trainerScore: 8.4,
      experience: 7.2,
      communication: 9.0,
      achievements: 7.8,
      activity: 8.6
    },
    disciplines: ["run", "swim"],
    description:
      "Вы можете больше, чем кажется! Присоединяйтесь к моей команде, чтобы начать не с понедельника, а уже сегодня.",
    price: 5000,
    priceFrom: true,
    currency: "RUB",
    remote: true,
    tags: ["Мотивация", "Команда"]
  }
];
