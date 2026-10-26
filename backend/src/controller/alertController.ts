import alertService from "../service/notification/alertService";
import { createHandler } from "../utils/controllerUtils";

const handle = createHandler("Não foi possível carregar os alertas");

export default {
  getSummary: handle(() => alertService.getSummary()),
};
