import type { CitizenReport, LandApplication, LandPlot } from "@/lib/types";

export const seedPlots: LandPlot[] = [
  { id: "p01", cadastral_number: "03-047-001-001", purpose: "ИЖС", area_ha: 0.12, latitude: 42.9006, longitude: 71.3647, status: "normal", deadline: null, updated_at: "2026-09-27T07:15:00Z" },
  { id: "p02", cadastral_number: "03-047-001-002", purpose: "Коммерческое использование", area_ha: 0.42, latitude: 42.9055, longitude: 71.3704, status: "pending", deadline: "2026-10-02", updated_at: "2026-09-27T08:20:00Z" },
  { id: "p03", cadastral_number: "03-047-001-003", purpose: "Сельхозназначение", area_ha: 1.85, latitude: 42.8957, longitude: 71.3762, status: "violation", deadline: "2026-09-30", updated_at: "2026-09-26T14:10:00Z" },
  { id: "p04", cadastral_number: "03-047-001-004", purpose: "ИЖС", area_ha: 0.10, latitude: 42.9088, longitude: 71.3600, status: "normal", deadline: null, updated_at: "2026-09-25T12:00:00Z" },
  { id: "p05", cadastral_number: "03-047-001-005", purpose: "Складское назначение", area_ha: 0.67, latitude: 42.8930, longitude: 71.3586, status: "in_progress", deadline: "2026-10-04", updated_at: "2026-09-27T09:40:00Z" },
  { id: "p06", cadastral_number: "03-047-001-006", purpose: "ИЖС", area_ha: 0.15, latitude: 42.9122, longitude: 71.3744, status: "normal", deadline: null, updated_at: "2026-09-24T09:00:00Z" },
  { id: "p07", cadastral_number: "03-047-001-007", purpose: "Сельхозназначение", area_ha: 2.10, latitude: 42.8886, longitude: 71.3690, status: "resolved", deadline: null, updated_at: "2026-09-26T16:20:00Z" },
  { id: "p08", cadastral_number: "03-047-001-008", purpose: "Общественная зона", area_ha: 0.35, latitude: 42.9018, longitude: 71.3832, status: "normal", deadline: null, updated_at: "2026-09-23T16:20:00Z" },
  { id: "p09", cadastral_number: "03-047-001-009", purpose: "ИЖС", area_ha: 0.14, latitude: 42.9143, longitude: 71.3661, status: "pending", deadline: "2026-10-03", updated_at: "2026-09-27T10:20:00Z" },
  { id: "p10", cadastral_number: "03-047-001-010", purpose: "Коммерческое использование", area_ha: 0.55, latitude: 42.8872, longitude: 71.3805, status: "violation", deadline: "2026-09-26", updated_at: "2026-09-25T10:30:00Z" },
  { id: "p11", cadastral_number: "03-047-001-011", purpose: "Сельхозназначение", area_ha: 1.40, latitude: 42.9181, longitude: 71.3810, status: "normal", deadline: null, updated_at: "2026-09-23T08:30:00Z" },
  { id: "p12", cadastral_number: "03-047-001-012", purpose: "ИЖС", area_ha: 0.11, latitude: 42.8830, longitude: 71.3641, status: "normal", deadline: null, updated_at: "2026-09-22T08:30:00Z" },
  { id: "p13", cadastral_number: "03-047-001-013", purpose: "Производственная зона", area_ha: 0.95, latitude: 42.8976, longitude: 71.3504, status: "violation", deadline: "2026-10-01", updated_at: "2026-09-27T05:30:00Z" },
  { id: "p14", cadastral_number: "03-047-001-014", purpose: "ИЖС", area_ha: 0.13, latitude: 42.9101, longitude: 71.3882, status: "normal", deadline: null, updated_at: "2026-09-20T08:30:00Z" },
  { id: "p15", cadastral_number: "03-047-001-015", purpose: "Сельхозназначение", area_ha: 2.55, latitude: 42.8798, longitude: 71.3740, status: "normal", deadline: null, updated_at: "2026-09-20T08:30:00Z" }
];

export const seedReports: CitizenReport[] = [
  { id: "r1042", telegram_user_id: "demo-502", category: "Стихийная свалка", latitude: 42.9051, longitude: 71.3699, description: "Мусор на пустующем участке рядом с жилыми домами.", photo_url: null, status: "pending", plot_id: "p02", deadline: null, created_at: "2026-09-27T08:18:00Z", updated_at: "2026-09-27T08:18:00Z" },
  { id: "r1041", telegram_user_id: "demo-416", category: "Земля не используется", latitude: 42.8954, longitude: 71.3760, description: "Участок долго не используется, территория заросла.", photo_url: null, status: "violation", plot_id: "p03", deadline: "2026-09-30", created_at: "2026-09-26T14:05:00Z", updated_at: "2026-09-26T14:10:00Z" },
  { id: "r1040", telegram_user_id: null, category: "Самозахват", latitude: 42.8870, longitude: 71.3801, description: "Временное ограждение выходит за границы участка.", photo_url: null, status: "violation", plot_id: "p10", deadline: "2026-09-26", created_at: "2026-09-25T10:20:00Z", updated_at: "2026-09-25T10:30:00Z" }
];

export const seedApplications: LandApplication[] = [
  { id: "a1", tracking_number: "KZ-2026-042", status: "На рассмотрении", stage: "Проверка документов", description: "Документы приняты и проходят первичную проверку.", eta: "3 рабочих дня", updated_at: "2026-09-27T07:00:00Z" },
  { id: "a2", tracking_number: "KZ-2026-043", status: "Назначен выезд инспектора", stage: "Полевой контроль", description: "Назначен выезд для подтверждения фактического состояния участка.", eta: "1-2 рабочих дня", updated_at: "2026-09-27T06:30:00Z" },
  { id: "a3", tracking_number: "KZ-2026-044", status: "Одобрено", stage: "Решение принято", description: "Заявление одобрено. Итоговый документ доступен в личном кабинете.", eta: "Завершено", updated_at: "2026-09-26T14:30:00Z" },
  { id: "a4", tracking_number: "KZ-2026-045", status: "Отказ", stage: "Решение принято", description: "Недостаточно документов. Требуется повторная подача после устранения замечаний.", eta: "Завершено", updated_at: "2026-09-26T11:00:00Z" }
];
