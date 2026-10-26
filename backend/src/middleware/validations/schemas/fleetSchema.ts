import { z } from "zod";
export const fleetSchema = z.enum([
  "Administrativa",
  "Assistencial",
  "Operacional",
  "SVO",
]);
