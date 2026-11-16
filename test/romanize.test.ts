import { describe, expect, it } from "vitest";
import { romanize } from "../src/romanize.js";

describe("romanize (MNS 5217:2012)", () => {
  it.each([
    ["Монгол", "Mongol"],
    ["Улаанбаатар", "Ulaanbaatar"],
    ["Өвөрхангай", "Övörkhangai"],
    ["Хөвсгөл", "Khövsgöl"],
    ["Сүхбаатар", "Sükhbaatar"],
    ["Цэцэрлэг", "Tsetserleg"],
    ["Говьсүмбэр", "Govisümber"],
    ["Чойбалсан", "Choibalsan"],
    ["Хэнтий", "Khentii"],
    ["Өндөрхаан", "Öndörkhaan"],
    ["Баруун-Урт", "Baruun-Urt"],
    ["Мөрөн", "Mörön"],
    ["Эрдэнэт", "Erdenet"],
    ["Чингэлтэй", "Chingeltei"],
  ])("%s -> %s", (input, expected) => {
    expect(romanize(input)).toBe(expected);
  });

  it("title-cases digraph letters at the start of a word", () => {
    expect(romanize("Ямар")).toBe("Yamar");
    expect(romanize("Юмсан")).toBe("Yumsan");
    expect(romanize("Шинэ")).toBe("Shine");
  });

  it("uppercases digraphs inside ALL-CAPS words", () => {
    expect(romanize("ЯАМ")).toBe("YAAM");
    expect(romanize("ШИНЭ")).toBe("SHINE");
    expect(romanize("ХОТ")).toBe("KHOT");
  });

  it("passes non-Cyrillic characters through", () => {
    expect(romanize("UB 2026, Улаанбаатар!")).toBe("UB 2026, Ulaanbaatar!");
  });

  it("returns an empty string for empty input", () => {
    expect(romanize("")).toBe("");
  });

  it("supports the ascii fallback", () => {
    expect(romanize("Өвөрхангай", { ascii: true })).toBe("Ovorkhangai");
    expect(romanize("Сүхбаатар", { ascii: true })).toBe("Sukhbaatar");
  });
});
