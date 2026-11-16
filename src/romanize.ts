/**
 * Mongolian Cyrillic -> Latin romanization following MNS 5217:2012.
 *
 * Notes on the standard:
 *  - ө -> ö, ү -> ü
 *  - е -> ye, ё -> yo, ю -> yu, я -> ya
 *  - х -> kh, ц -> ts, ч -> ch, ш -> sh, щ -> sh, ж -> j
 *  - й, ь, ъ all map to i (so the mapping is lossy and cannot be reversed reliably)
 *  - ы -> y, э -> e
 */

const MAP: Record<string, string> = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "ye",
  ё: "yo",
  ж: "j",
  з: "z",
  и: "i",
  й: "i",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  ө: "ö",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ү: "ü",
  ф: "f",
  х: "kh",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "sh",
  ъ: "i",
  ы: "y",
  ь: "i",
  э: "e",
  ю: "yu",
  я: "ya",
};

export interface RomanizeOptions {
  /**
   * Replace ö/ü with plain o/u. This is a lossy convenience fallback for systems
   * that cannot store diacritics. It is NOT part of MNS 5217:2012.
   */
  ascii?: boolean;
}

const isLetter = (ch: string | undefined): boolean => !!ch && /\p{L}/u.test(ch);
const isUpper = (ch: string | undefined): boolean =>
  !!ch && ch !== ch.toLowerCase() && ch === ch.toUpperCase();

export function romanize(text: string, options: RomanizeOptions = {}): string {
  const chars = Array.from(text);
  let out = "";

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    const lower = ch.toLowerCase();
    const mapped = MAP[lower];

    if (mapped === undefined) {
      out += ch;
      continue;
    }

    if (!isUpper(ch)) {
      out += mapped;
      continue;
    }

    if (mapped.length === 1) {
      out += mapped.toUpperCase();
      continue;
    }

    // Multi-letter output for an uppercase letter: "Ya" in a normal word,
    // "YA" when it sits inside an ALL-CAPS word.
    const next = chars[i + 1];
    const prev = chars[i - 1];
    const allCaps =
      (isLetter(next) && isUpper(next)) ||
      (!isLetter(next) && isLetter(prev) && isUpper(prev));

    out += allCaps
      ? mapped.toUpperCase()
      : mapped.charAt(0).toUpperCase() + mapped.slice(1);
  }

  return options.ascii ? out.replace(/ö/g, "o").replace(/Ö/g, "O").replace(/ü/g, "u").replace(/Ü/g, "U") : out;
}
