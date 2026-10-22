import notifModel, { Notification } from "../models/notifModel";
import notifSchema, { notifIdSchema } from "../middleware/validations/schemas/notifSchema";
import maintanceSchema from "../middleware/validations/schemas/maintanceSchema";

const success = (message: unknown, status = 200) => ({ type: "success", message, status });
const error = (message: string, status: number) => ({ type: "error", message, status });
const invalidId = (id: string) => !notifIdSchema.safeParse(id).success;
const notFound = () => error("Notification not found", 404);

const handleDuplicateKeyError = (cause: unknown) => {
  const dbError = cause as { code?: string; constraint?: string };
  if (dbError?.code !== "23505") throw cause;
  if (dbError.constraint === "id") return error("notificacao já cadastrada", 409);
  throw cause;
};

const getAllNotif = async () => success(((await notifModel.getAllNotif())));

const getNotifById = async (id: string) => {
  if (invalidId(id)) return error("Invalid notification id", 400);
  const notification = await notifModel.getNotifById(id);
  return notification ? success(notification): notFound();
}

const createNotif = async (body: unknown) => {
  const validation = notifSchema.safeParse(body);
  if (!validation.success) return error(validation.error.message, 400);
  try {
    const createdNotification = await notifModel.createNotif(validation.data as Notification);
    return success((createdNotification), 201);
  } catch (cause) {
    return handleDuplicateKeyError(cause);
  }
};

const updateNotif = async (id: string, body: unknown) => {
  if (invalidId(id)) return error("invalid notification id", 400);
  const validation = notifSchema.safeParse(body);
  if (validation.error) return error(validation.error.message, 400);
  try {
      const notificatoin = await notifModel.updateNotif(id, validation.data);
      return notificatoin ? success((notificatoin), 200): notFound()
    } catch (cause) {
      return handleDuplicateKeyError(cause);
    }
};

const deleteNotif = async (id: string) => {
  if (invalidId(id)) return error("Invalid notification ID", 400);
  return await notifModel.deleteNotif(id) ? success("Notification deleted succesfully") : notFound();
};

export = {
  getAllNotif,
  getNotifById,
  createNotif,
  updateNotif,
  deleteNotif
}