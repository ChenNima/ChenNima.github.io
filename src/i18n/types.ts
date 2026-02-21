import type zh from "./locales/zh";

export type Locale = "zh" | "en";
export type TranslationKey = keyof typeof zh;
