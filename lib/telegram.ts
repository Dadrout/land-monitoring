import { adminSupabase } from "@/lib/supabase";

type TelegramUpdate = {
  message?: { message_id: number; from?: { id: number; first_name?: string }; chat: { id: number }; text?: string; location?: { latitude: number; longitude: number }; photo?: { file_id: string; file_size?: number }[] };
  callback_query?: { id: string; from: { id: number }; data?: string; message?: { chat: { id: number }; message_id: number } };
};

type Session = { step: "idle" | "await_tracking" | "await_category" | "await_location" | "await_photo" | "await_description" | "await_confirm"; category?: string; latitude?: number; longitude?: number; photoFileId?: string; description?: string };

const localSessions = new Map<string, Session>();
const token = () => process.env.TELEGRAM_BOT_TOKEN;
const api = (method: string) => `https://api.telegram.org/bot${token()}/${method}`;

async function tg(method: string, body: Record<string, unknown>) {
  if (!token()) throw new Error("TELEGRAM_BOT_TOKEN is not configured");
  const response = await fetch(api(method), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!response.ok) throw new Error(`Telegram ${method} failed: ${await response.text()}`);
  return response.json();
}

async function loadSession(userId: string): Promise<Session> {
  const db = adminSupabase();
  if (!db) return localSessions.get(userId) ?? { step: "idle" };
  const { data } = await db.from("telegram_sessions").select("payload").eq("telegram_user_id", userId).maybeSingle();
  return (data?.payload as Session | undefined) ?? { step: "idle" };
}
async function saveSession(userId: string, session: Session) {
  const db = adminSupabase();
  if (!db) { localSessions.set(userId, session); return; }
  await db.from("telegram_sessions").upsert({ telegram_user_id: userId, payload: session, updated_at: new Date().toISOString() }, { onConflict: "telegram_user_id" });
}

const mainKeyboard = { inline_keyboard: [[{ text: "🔎 Проверить заявление", callback_data: "application" }],[{ text: "📚 Земельные услуги", callback_data: "knowledge" }],[{ text: "🚨 Сообщить о нарушении", callback_data: "report" }]] };
const categoriesKeyboard = { inline_keyboard: [[{ text: "🗑 Стихийная свалка", callback_data: "cat:Стихийная свалка" }],[{ text: "🌱 Земля не используется", callback_data: "cat:Земля не используется" }],[{ text: "🚧 Самозахват", callback_data: "cat:Самозахват" }],[{ text: "❓ Другое", callback_data: "cat:Другое" }]] };
const knowledgeKeyboard = { inline_keyboard: [[{ text: "🏡 Земля под ИЖС", callback_data: "kb:izhs" }],[{ text: "🔄 Изменить назначение", callback_data: "kb:purpose" }],[{ text: "📑 Продлить аренду", callback_data: "kb:rent" }],[{ text: "⬅️ Главное меню", callback_data: "home" }]] };

async function send(chatId: number, text: string, reply_markup?: unknown) { return tg("sendMessage", { chat_id: chatId, text, parse_mode: "HTML", reply_markup }); }

async function applicationText(tracking: string) {
  const db = adminSupabase();
  if (!db) {
    const { seedApplications } = await import("@/lib/seed");
    const item = seedApplications.find((a) => a.tracking_number === tracking);
    return item ? `📄 <b>${item.tracking_number}</b>\n\nСтатус: <b>${item.status}</b>\nЭтап: ${item.stage}\n\n${item.description}\n\nОриентировочный срок: ${item.eta}` : null;
  }
  const { data } = await db.from("land_applications").select("*").eq("tracking_number", tracking).maybeSingle();
  return data ? `📄 <b>${data.tracking_number}</b>\n\nСтатус: <b>${data.status}</b>\nЭтап: ${data.stage}\n\n${data.description}\n\nОриентировочный срок: ${data.eta}` : null;
}

async function downloadTelegramPhoto(fileId: string): Promise<string | null> {
  const db = adminSupabase(); if (!db || !token()) return null;
  const result = await tg("getFile", { file_id: fileId });
  const filePath = result?.result?.file_path as string | undefined; if (!filePath) return null;
  const raw = await fetch(`https://api.telegram.org/file/bot${token()}/${filePath}`); if (!raw.ok) return null;
  const buffer = await raw.arrayBuffer(); const ext = filePath.split(".").pop() || "jpg"; const path = `${Date.now()}-${fileId}.${ext}`;
  const { error } = await db.storage.from("report-photos").upload(path, buffer, { contentType: raw.headers.get("content-type") ?? "image/jpeg", upsert: false });
  if (error) return null;
  return db.storage.from("report-photos").getPublicUrl(path).data.publicUrl;
}

async function createReport(userId: string, session: Session) {
  const db = adminSupabase();
  const input = { telegram_user_id: userId, category: session.category ?? "Другое", latitude: session.latitude!, longitude: session.longitude!, description: session.description ?? "Без описания", photo_url: session.photoFileId ? await downloadTelegramPhoto(session.photoFileId) : null, status: "pending" as const, plot_id: null, deadline: null };
  if (!db) { const { demoCreateReport } = await import("@/lib/demo-store"); return demoCreateReport(input); }
  const { data, error } = await db.from("citizen_reports").insert(input).select("*").single(); if (error) throw error; return data;
}

export async function handleTelegramUpdate(update: TelegramUpdate) {
  if (update.callback_query) {
    const q = update.callback_query; const chatId = q.message?.chat.id; if (!chatId) return;
    await tg("answerCallbackQuery", { callback_query_id: q.id });
    const userId = String(q.from.id); const data = q.data ?? "";
    if (data === "home") { await saveSession(userId,{step:"idle"}); return send(chatId,"🌍 <b>JerMonitor</b>\n\nЧто хотите сделать?",mainKeyboard); }
    if (data === "application") { await saveSession(userId,{step:"await_tracking"}); return send(chatId,"🔎 Введите трек-номер заявления, например <b>KZ-2026-042</b>."); }
    if (data === "knowledge") return send(chatId,"📚 Выберите земельную услугу:",knowledgeKeyboard);
    if (data === "report") { await saveSession(userId,{step:"await_category"}); return send(chatId,"🚨 Что вы обнаружили?",categoriesKeyboard); }
    if (data.startsWith("cat:")) { const category=data.slice(4); await saveSession(userId,{step:"await_location",category}); return send(chatId,"📍 Отправьте геолокацию через кнопку Telegram «Местоположение». "); }
    if (data === "confirm") { const session=await loadSession(userId); if(session.step!=="await_confirm") return; await createReport(userId,session); await saveSession(userId,{step:"idle"}); return send(chatId,"✅ <b>Сигнал отправлен.</b>\n\nОн уже доступен инспектору на карте как новая точка на проверку.",mainKeyboard); }
    if (data === "cancel_report") { await saveSession(userId,{step:"idle"}); return send(chatId,"Отправка отменена.",mainKeyboard); }
    if (data.startsWith("kb:")) {
      const key=data.slice(3); const texts:Record<string,string>={ izhs:"🏡 <b>Получение участка под ИЖС</b>\n\n1. Подать заявление через eGov/уполномоченный орган.\n2. Указать населённый пункт и цель.\n3. Отслеживать статус по трек-номеру.\n\nДля MVP используется справочная инструкция; финальные регламенты должны синхронизироваться с официальным источником.", purpose:"🔄 <b>Изменение целевого назначения</b>\n\n1. Подготовить заявление.\n2. Указать текущие и требуемые параметры участка.\n3. Приложить требуемые документы.\n4. Отслеживать статус рассмотрения.", rent:"📑 <b>Продление договора аренды</b>\n\n1. Проверить срок действующего договора.\n2. Подать заявление на продление.\n3. Приложить договор и документы на участок.\n4. Получить решение уполномоченного органа." };
      return send(chatId,texts[key]??"Инструкция пока недоступна",knowledgeKeyboard);
    }
  }

  const message = update.message; if (!message?.from) return; const chatId=message.chat.id; const userId=String(message.from.id); const text=(message.text??"").trim();
  if (text === "/start" || text === "/menu") { await saveSession(userId,{step:"idle"}); return send(chatId,`🌍 <b>JerMonitor</b>\n\nЗдравствуйте${message.from.first_name ? `, ${message.from.first_name}` : ""}!\n\nПроверяйте заявления, находите инструкции и сообщайте о проблемных участках.`,mainKeyboard); }
  const session=await loadSession(userId);
  if (session.step === "await_tracking" && text) { const tracking=text.toUpperCase(); const info=await applicationText(tracking); await saveSession(userId,{step:"idle"}); return send(chatId,info??`❌ Заявление <b>${tracking}</b> не найдено.`,mainKeyboard); }
  if (session.step === "await_location" && message.location) { await saveSession(userId,{...session,step:"await_photo",latitude:message.location.latitude,longitude:message.location.longitude}); return send(chatId,"📷 Геолокация получена. Теперь отправьте фотографию нарушения."); }
  if (session.step === "await_photo" && message.photo?.length) { const photo=message.photo.at(-1)!; await saveSession(userId,{...session,step:"await_description",photoFileId:photo.file_id}); return send(chatId,"✏️ Фото получено. Кратко опишите проблему одним сообщением."); }
  if (session.step === "await_description" && text) { const next={...session,step:"await_confirm" as const,description:text}; await saveSession(userId,next); return send(chatId,`✅ <b>Проверьте сигнал</b>\n\nТип: ${next.category}\n📍 Геолокация: получена\n📷 Фото: получено\n\nОписание: ${next.description}`,{inline_keyboard:[[{text:"✅ Отправить",callback_data:"confirm"}],[{text:"✖️ Отменить",callback_data:"cancel_report"}]]}); }
  return send(chatId,"Используйте кнопки меню, чтобы продолжить.",mainKeyboard);
}
