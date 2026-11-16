import { romanize } from "./romanize.js";
import { SOUM_ROWS } from "./soums.data.js";

export interface Aimag {
  id: string;
  /** NSO administrative unit code. The OCHA P-code is "MN" + code. */
  code: string;
  nameMn: string;
  nameEn: string;
  capitalMn: string;
  capitalEn: string;
  /** Extra spellings people actually use. Matched after normalization. */
  aliases?: string[];
  /** Same for the capital city. */
  capitalAliases?: string[];
  /** True for Ulaanbaatar, which is a provincial-level municipality, not an aimag. */
  isCapitalCity?: boolean;
}

export interface UbDistrict {
  id: string;
  /** NSO administrative unit code. The OCHA P-code is "MN" + code. */
  code: string;
  nameMn: string;
  nameEn: string;
  aliases?: string[];
}

/**
 * 21 aimags plus the capital city Ulaanbaatar (22 first-level divisions).
 * Codes: OCHA COD-AB Mongolia v01 (https://data.humdata.org/dataset/cod-ab-mng).
 */
export const AIMAGS: Aimag[] = [
  { id: "arkhangai", code: "65", nameMn: "Архангай", nameEn: "Arkhangai", capitalMn: "Цэцэрлэг", capitalEn: "Tsetserleg" },
  { id: "bayan-olgii", code: "83", nameMn: "Баян-Өлгий", nameEn: "Bayan-Ölgii", capitalMn: "Өлгий", capitalEn: "Ölgii", aliases: ["Bayan-Ulgii", "Bayan Olgii"] },
  { id: "bayankhongor", code: "64", nameMn: "Баянхонгор", nameEn: "Bayankhongor", capitalMn: "Баянхонгор", capitalEn: "Bayankhongor" },
  { id: "bulgan", code: "63", nameMn: "Булган", nameEn: "Bulgan", capitalMn: "Булган", capitalEn: "Bulgan" },
  { id: "darkhan-uul", code: "45", nameMn: "Дархан-Уул", nameEn: "Darkhan-Uul", capitalMn: "Дархан", capitalEn: "Darkhan" },
  { id: "dornod", code: "21", nameMn: "Дорнод", nameEn: "Dornod", capitalMn: "Чойбалсан", capitalEn: "Choibalsan" },
  { id: "dornogovi", code: "44", nameMn: "Дорноговь", nameEn: "Dornogovi", capitalMn: "Сайншанд", capitalEn: "Sainshand", aliases: ["Dornogobi"] },
  { id: "dundgovi", code: "48", nameMn: "Дундговь", nameEn: "Dundgovi", capitalMn: "Мандалговь", capitalEn: "Mandalgovi", aliases: ["Dundgobi"] },
  { id: "govi-altai", code: "82", nameMn: "Говь-Алтай", nameEn: "Govi-Altai", capitalMn: "Алтай", capitalEn: "Altai", aliases: ["Gobi-Altai", "Gobi Altai"] },
  { id: "govisumber", code: "42", nameMn: "Говьсүмбэр", nameEn: "Govisümber", capitalMn: "Чойр", capitalEn: "Choir", aliases: ["Gobisumber", "Govi-Sumber"] },
  {
    id: "khentii",
    code: "23",
    nameMn: "Хэнтий",
    nameEn: "Khentii",
    capitalMn: "Чингис",
    capitalEn: "Chinggis",
    // Renamed from Öndörkhaan to Chinggis City in 2013; people still use the old name.
    capitalAliases: ["Öndörkhaan", "Ondorkhaan", "Undurkhaan", "Өндөрхаан", "Chinggis City", "Чингис хот"],
  },
  { id: "khovd", code: "84", nameMn: "Ховд", nameEn: "Khovd", capitalMn: "Ховд", capitalEn: "Khovd" },
  { id: "khovsgol", code: "67", nameMn: "Хөвсгөл", nameEn: "Khövsgöl", capitalMn: "Мөрөн", capitalEn: "Mörön", aliases: ["Khuvsgul", "Hovsgol", "Huvsgul"] },
  { id: "omnogovi", code: "46", nameMn: "Өмнөговь", nameEn: "Ömnögovi", capitalMn: "Даланзадгад", capitalEn: "Dalanzadgad", aliases: ["Umnugovi", "Omnogobi", "Umnugobi"] },
  { id: "orkhon", code: "61", nameMn: "Орхон", nameEn: "Orkhon", capitalMn: "Эрдэнэт", capitalEn: "Erdenet" },
  { id: "ovorkhangai", code: "62", nameMn: "Өвөрхангай", nameEn: "Övörkhangai", capitalMn: "Арвайхээр", capitalEn: "Arvaikheer", aliases: ["Uvurkhangai", "Uvurhangai"] },
  { id: "selenge", code: "43", nameMn: "Сэлэнгэ", nameEn: "Selenge", capitalMn: "Сүхбаатар", capitalEn: "Sükhbaatar" },
  { id: "sukhbaatar", code: "22", nameMn: "Сүхбаатар", nameEn: "Sükhbaatar", capitalMn: "Баруун-Урт", capitalEn: "Baruun-Urt" },
  { id: "tov", code: "41", nameMn: "Төв", nameEn: "Töv", capitalMn: "Зуунмод", capitalEn: "Zuunmod", aliases: ["Tuv"] },
  { id: "uvs", code: "85", nameMn: "Увс", nameEn: "Uvs", capitalMn: "Улаангом", capitalEn: "Ulaangom" },
  { id: "zavkhan", code: "81", nameMn: "Завхан", nameEn: "Zavkhan", capitalMn: "Улиастай", capitalEn: "Uliastai" },
  {
    id: "ulaanbaatar",
    code: "11",
    nameMn: "Улаанбаатар",
    nameEn: "Ulaanbaatar",
    capitalMn: "Улаанбаатар",
    capitalEn: "Ulaanbaatar",
    aliases: ["Ulan Bator", "UB"],
    isCapitalCity: true,
  },
];

/**
 * The 9 municipal districts (дүүрэг) of Ulaanbaatar. Khoroos are not included.
 * Codes: OCHA COD-AB Mongolia v01 (https://data.humdata.org/dataset/cod-ab-mng).
 */
export const UB_DISTRICTS: UbDistrict[] = [
  { id: "baganuur", code: "1101", nameMn: "Багануур", nameEn: "Baganuur" },
  { id: "bagakhangai", code: "1104", nameMn: "Багахангай", nameEn: "Bagakhangai" },
  { id: "bayangol", code: "1107", nameMn: "Баянгол", nameEn: "Bayangol" },
  { id: "bayanzurkh", code: "1110", nameMn: "Баянзүрх", nameEn: "Bayanzürkh" },
  { id: "chingeltei", code: "1125", nameMn: "Чингэлтэй", nameEn: "Chingeltei" },
  { id: "khan-uul", code: "1122", nameMn: "Хан-Уул", nameEn: "Khan-Uul" },
  { id: "nalaikh", code: "1113", nameMn: "Налайх", nameEn: "Nalaikh" },
  { id: "songinokhairkhan", code: "1116", nameMn: "Сонгинохайрхан", nameEn: "Songinokhairkhan" },
  { id: "sukhbaatar-district", code: "1119", nameMn: "Сүхбаатар", nameEn: "Sükhbaatar" },
];

export interface Soum {
  /** NSO administrative unit code. The OCHA P-code is "MN" + code. */
  code: string;
  nameMn: string;
  /** MNS 5217:2012 romanization of nameMn, not an official English name. */
  nameEn: string;
  aimagId: string;
}

/**
 * The 330 soums (сум) of the 21 aimags, names verbatim from OCHA COD-AB Mongolia v01
 * (original source: National Statistical Office). Bags are not included.
 */
export const SOUMS: Soum[] = SOUM_ROWS.map(([code, nameMn]) => ({
  code,
  nameMn,
  nameEn: romanize(nameMn),
  aimagId: AIMAGS.find((a) => a.code === code.slice(0, 2))!.id,
}));

/**
 * Reduce a name to a comparable key so "Khövsgöl", "Хөвсгөл", "Khuvsgul" style
 * variants line up. Cyrillic input is romanized first.
 *
 * This is intentionally fuzzy: it is for matching, never for display.
 */
export function normalizeName(input: string): string {
  return romanize(input)
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/kh/g, "h")
    .replace(/y/g, "i")
    .replace(/[^a-z]/g, "");
}

export type Match =
  | { type: "aimag"; aimag: Aimag }
  | { type: "aimag_capital"; aimag: Aimag }
  | { type: "ub_district"; district: UbDistrict }
  | { type: "soum"; soum: Soum };

interface IndexEntry {
  keys: string[];
  match: Match;
}

function buildIndex(): IndexEntry[] {
  const entries: IndexEntry[] = [];

  for (const aimag of AIMAGS) {
    entries.push({
      keys: [aimag.nameMn, aimag.nameEn, aimag.id, ...(aimag.aliases ?? [])].map(normalizeName),
      match: { type: "aimag", aimag },
    });
    entries.push({
      keys: [aimag.capitalMn, aimag.capitalEn, ...(aimag.capitalAliases ?? [])].map(normalizeName),
      match: { type: "aimag_capital", aimag },
    });
  }

  for (const district of UB_DISTRICTS) {
    entries.push({
      keys: [district.nameMn, district.nameEn, ...(district.aliases ?? [])].map(normalizeName),
      match: { type: "ub_district", district },
    });
  }

  for (const soum of SOUMS) {
    entries.push({ keys: [soum.nameMn, soum.nameEn].map(normalizeName), match: { type: "soum", soum } });
  }

  return entries;
}

const INDEX = buildIndex();

export interface SearchResult {
  exact: Match[];
  partial: Match[];
}

/**
 * Find aimags, aimag capitals, Ulaanbaatar districts and soums by name in Cyrillic
 * or any common Latin spelling. Names are not unique ("Sükhbaatar" is an aimag, the
 * capital of Selenge, and a UB district), so this returns every hit.
 */
export function searchAdmin(query: string): SearchResult {
  const key = normalizeName(query);
  if (!key) return { exact: [], partial: [] };

  const exact: Match[] = [];
  const partial: Match[] = [];

  for (const entry of INDEX) {
    if (entry.keys.includes(key)) {
      exact.push(entry.match);
    } else if (key.length >= 3 && entry.keys.some((k) => k.startsWith(key))) {
      partial.push(entry.match);
    }
  }

  return { exact, partial };
}
