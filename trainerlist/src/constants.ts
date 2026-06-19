import { DisciplineKey, PriorityKey } from "./types";

/** A user may emphasise at most this many rating components. */
export const MAX_PRIORITIES = 3;

/** Total trainers in the catalog — placeholder for the hero stat. */
export const TOTAL_TRAINERS = 170;

export interface PriorityMeta {
  key: PriorityKey;
  label: string;
  hint: string;
  /** Relative weight in the overall score (just for the "из чего складывается" view). */
  weight: number;
}

export const PRIORITIES: PriorityMeta[] = [
  {
    key: "studentProgress",
    label: "Прогресс учеников",
    hint: "Реальные результаты подопечных: рост темпа, дистанций, выполнение планов.",
    weight: 0.25
  },
  {
    key: "trainerScore",
    label: "Оценка работы тренера",
    hint: "Средняя оценка от учеников за качество тренировочного процесса.",
    weight: 0.2
  },
  {
    key: "experience",
    label: "Опыт работы",
    hint: "Стаж тренерской работы и количество проведённых тренировок.",
    weight: 0.15
  },
  {
    key: "communication",
    label: "Качество общения",
    hint: "Скорость ответа, обратная связь и вовлечённость в диалог с учеником.",
    weight: 0.15
  },
  {
    key: "achievements",
    label: "Личные достижения",
    hint: "Спортивные результаты самого тренера: старты, разряды, рекорды.",
    weight: 0.15
  },
  {
    key: "activity",
    label: "Активность на платформе",
    hint: "Регулярность присутствия и работы тренера на S10.",
    weight: 0.1
  }
];

export const PRIORITY_LABEL: Record<PriorityKey, string> = PRIORITIES.reduce(
  (acc, item) => {
    acc[item.key] = item.label;
    return acc;
  },
  {} as Record<PriorityKey, string>
);

export interface DisciplineMeta {
  key: DisciplineKey;
  label: string;
  icon: string;
}

export const DISCIPLINES: DisciplineMeta[] = [
  { key: "run", label: "Бег", icon: "🏃" },
  { key: "bike", label: "Вело", icon: "🚴" },
  { key: "swim", label: "Плавание", icon: "🏊" }
];

export const DISCIPLINE_META: Record<DisciplineKey, DisciplineMeta> = DISCIPLINES.reduce(
  (acc, item) => {
    acc[item.key] = item;
    return acc;
  },
  {} as Record<DisciplineKey, DisciplineMeta>
);
