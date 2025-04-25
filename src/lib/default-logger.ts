import { createLogger } from "./logger";
import { logLevel } from "../config";

export const logger = createLogger({ level: logLevel });
