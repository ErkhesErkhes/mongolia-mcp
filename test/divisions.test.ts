import { describe, expect, it } from "vitest";
import { AIMAGS, SOUMS, UB_DISTRICTS, normalizeName, searchAdmin } from "../src/divisions.js";

describe("data shape", () => {
  it("has 21 aimags plus Ulaanbaatar", () => {
    expect(AIMAGS).toHaveLength(22);
    expect(AIMAGS.filter((a) => a.isCapitalCity)).toHaveLength(1);
  });

  it("has 9 Ulaanbaatar districts", () => {
    expect(UB_DISTRICTS).toHaveLength(9);
  });

  it("has unique ids", () => {
    const ids = [...AIMAGS.map((a) => a.id), ...UB_DISTRICTS.map((d) => d.id)];
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has unique codes, and districts are coded under Ulaanbaatar", () => {
    const codes = [...AIMAGS, ...UB_DISTRICTS, ...SOUMS].map((x) => x.code);
    expect(new Set(codes).size).toBe(codes.length);
    expect(UB_DISTRICTS.every((d) => /^11\d\d$/.test(d.code))).toBe(true);
  });

  it("has 330 soums, every one in a real aimag and none in Ulaanbaatar", () => {
    expect(SOUMS).toHaveLength(330);
    const perAimag = new Map<string, number>();
    for (const s of SOUMS) {
      expect(s.code).toMatch(/^\d{4}$/);
      perAimag.set(s.aimagId, (perAimag.get(s.aimagId) ?? 0) + 1);
    }
    expect(perAimag.size).toBe(21);
    expect(perAimag.has("ulaanbaatar")).toBe(false);
    // Spot checks against well-known counts.
    expect(perAimag.get("tov")).toBe(27);
    expect(perAimag.get("orkhon")).toBe(2);
    expect(perAimag.get("govisumber")).toBe(3);
  });
});

describe("normalizeName", () => {
  it("treats Cyrillic and Latin spellings as the same key", () => {
    expect(normalizeName("Хөвсгөл")).toBe(normalizeName("Khövsgöl"));
    expect(normalizeName("Khövsgöl")).toBe(normalizeName("Hovsgol"));
  });
});

describe("searchAdmin", () => {
  const aimagIds = (query: string) =>
    searchAdmin(query)
      .exact.filter((m) => m.type === "aimag")
      .map((m) => (m.type === "aimag" ? m.aimag.id : ""));

  it("finds an aimag by Cyrillic name", () => {
    expect(aimagIds("Хөвсгөл")).toEqual(["khovsgol"]);
  });

  it.each([
    ["Khuvsgul", "khovsgol"],
    ["hovsgol", "khovsgol"],
    ["Uvurkhangai", "ovorkhangai"],
    ["Umnugovi", "omnogovi"],
    ["Bayan-Ulgii", "bayan-olgii"],
    ["Gobi-Altai", "govi-altai"],
    ["Ulan Bator", "ulaanbaatar"],
    ["Khovd", "khovd"],
    ["Hovd", "khovd"],
  ])("finds %s as %s", (query, id) => {
    expect(aimagIds(query)).toEqual([id]);
  });

  it("finds a capital city and points back to its aimag", () => {
    const { exact } = searchAdmin("Erdenet");
    expect(exact).toHaveLength(1);
    expect(exact[0].type).toBe("aimag_capital");
    expect(exact[0].type === "aimag_capital" && exact[0].aimag.id).toBe("orkhon");
  });

  it("knows Khentii's capital under both its old and new name", () => {
    for (const q of ["Chinggis", "Öndörkhaan", "Ondorkhaan", "Өндөрхаан"]) {
      const { exact } = searchAdmin(q);
      expect(exact.some((m) => m.type === "aimag_capital" && m.aimag.id === "khentii")).toBe(true);
    }
  });

  it("returns every hit for an ambiguous name", () => {
    const types = searchAdmin("Sükhbaatar").exact.map((m) => m.type).sort();
    // Aimag, capital of Selenge, UB district, plus a soum in Selenge and one in Sükhbaatar aimag.
    expect(types).toEqual(["aimag", "aimag_capital", "soum", "soum", "ub_district"]);
  });

  it("finds UB districts", () => {
    const { exact } = searchAdmin("Songinokhairkhan");
    expect(exact).toHaveLength(1);
    expect(exact[0].type).toBe("ub_district");
  });

  it("finds a soum by Cyrillic or Latin name and points back to its aimag", () => {
    for (const q of ["Рэнчинлхүмбэ", "Renchinlkhümbe", "renchinlhumbe"]) {
      const { exact } = searchAdmin(q);
      expect(exact).toHaveLength(1);
      expect(exact[0].type === "soum" && exact[0].soum).toMatchObject({ code: "6728", aimagId: "khovsgol" });
    }
  });

  it("returns same-named soums from different aimags", () => {
    const aimags = searchAdmin("Жаргалант").exact.map((m) => (m.type === "soum" ? m.soum.aimagId : m.type));
    expect(aimags.sort()).toEqual(["arkhangai", "bayankhongor", "khovd", "khovsgol", "orkhon", "tov"]);
  });

  it("falls back to prefix matches", () => {
    const { exact, partial } = searchAdmin("Tsetser");
    expect(exact).toHaveLength(0);
    expect(partial.length).toBeGreaterThan(0);
  });

  it("returns nothing for junk", () => {
    expect(searchAdmin("zzzz")).toEqual({ exact: [], partial: [] });
    expect(searchAdmin("")).toEqual({ exact: [], partial: [] });
  });
});
