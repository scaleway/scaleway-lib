import { pad as lodashPad } from "lodash";

export const calc = (a, b) => a + b;
export const pad = (str, length) => lodashPad(str, length);
