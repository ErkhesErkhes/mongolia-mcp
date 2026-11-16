import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { romanize } from "./romanize.js";
import { AIMAGS, SOUMS, UB_DISTRICTS, searchAdmin } from "./divisions.js";

const json = (value: unknown) => ({
  content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }],
});

export function createServer(): McpServer {
  const server = new McpServer({ name: "mongolia-mcp", version: "0.2.0" });

  server.registerTool(
    "romanize_mongolian",
    {
      title: "Romanize Mongolian Cyrillic",
      description:
        "Convert Mongolian Cyrillic text to Latin letters using the national standard MNS 5217:2012 " +
        "(ө -> ö, ү -> ü, х -> kh, ц -> ts, ч -> ch, ш -> sh, е -> ye, ю -> yu, я -> ya, й/ь/ъ -> i). " +
        "One-way and lossy by design. Non-Cyrillic characters pass through unchanged.",
      inputSchema: {
        text: z.string().min(1).max(20000).describe("Mongolian Cyrillic text"),
        ascii: z
          .boolean()
          .optional()
          .describe("Replace ö/ü with o/u. Lossy fallback that is not part of the standard."),
      },
    },
    async ({ text, ascii }) => ({
      content: [{ type: "text" as const, text: romanize(text, { ascii }) }],
    }),
  );

  server.registerTool(
    "lookup_mongolian_place",
    {
      title: "Look up a Mongolian aimag, aimag capital, soum or Ulaanbaatar district",
      description:
        "Find an aimag (province), an aimag capital city, a soum, or an Ulaanbaatar district by name. " +
        "Accepts Cyrillic or common Latin spellings (e.g. 'Хөвсгөл', 'Khuvsgul', 'Hovsgol'). " +
        "Names are often ambiguous (Sükhbaatar is an aimag, a city, two soums and a UB district), so all matches are returned. " +
        "Each soum carries the id of its aimag. Bags and khoroos are not included.",
      inputSchema: {
        query: z.string().min(1).max(200).describe("Place name in Cyrillic or Latin"),
      },
    },
    async ({ query }) => {
      const { exact, partial } = searchAdmin(query);
      return json({ query, exact, partial: exact.length ? [] : partial });
    },
  );

  server.registerTool(
    "list_mongolian_aimags",
    {
      title: "List Mongolian aimags",
      description:
        "List all 21 aimags plus Ulaanbaatar, with NSO and ISO 3166-2 codes, Cyrillic and English names and capital cities.",
      inputSchema: {},
    },
    async () => json(AIMAGS),
  );

  server.registerTool(
    "list_ulaanbaatar_districts",
    {
      title: "List Ulaanbaatar districts",
      description: "List the 9 municipal districts (дүүрэг) of Ulaanbaatar with Cyrillic and English names.",
      inputSchema: {},
    },
    async () => json(UB_DISTRICTS),
  );

  server.registerTool(
    "list_mongolian_soums",
    {
      title: "List Mongolian soums",
      description:
        "List soums (сум, second-level divisions) with their NSO code, Cyrillic name and MNS 5217:2012 romanization. " +
        "Pass an aimag name or id to get only that aimag's soums; without it all 330 are returned. " +
        "Source: OCHA COD-AB Mongolia v01 (National Statistical Office data). Bags are not included.",
      inputSchema: {
        aimag: z.string().min(1).max(200).optional().describe("Aimag name or id, Cyrillic or Latin (e.g. 'Хөвсгөл', 'Khuvsgul')"),
      },
    },
    async ({ aimag }) => {
      if (!aimag) return json(SOUMS);
      const ids = searchAdmin(aimag).exact.flatMap((m) => (m.type === "aimag" ? [m.aimag.id] : []));
      if (!ids.length) return { ...json({ error: `No aimag matches "${aimag}". Use list_mongolian_aimags to see valid names.` }), isError: true };
      return json(SOUMS.filter((s) => ids.includes(s.aimagId)));
    },
  );

  return server;
}
