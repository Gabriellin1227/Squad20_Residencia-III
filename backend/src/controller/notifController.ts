import notifService from "../service/notifService";
import { createHandler, idFrom } from "../utils/controllerUtils";

const handle = createHandler(
  "Não foi possível concluir a operação de notificações",
);

export default {
  getAllNotif: handle(() => notifService.getAllNotif()),
  getNotifById: handle((req) => notifService.getNotifById(idFrom(req))),
  createNotif: handle((req) => notifService.createNotif(req.body)),
  updateNotif: handle((req) => notifService.updateNotif(idFrom(req), req.body)),
  deleteNotif: handle((req) => notifService.deleteNotif(idFrom(req))),
};
