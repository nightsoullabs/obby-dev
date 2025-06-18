const templates = {
  "nextjs-developer": {
    name: "Next.js developer",
    lib: [
      "nextjs@15.3.3",
      "typescript",
      "@types/node",
      "@types/react",
      "@types/react-dom",
      "postcss",
      "motion",
      "tailwindcss",
      "shadcn",
      "three",
      "@types/three",
      "@react-three/fiber",
    ],
    file: "pages/index.tsx",
    instructions:
      "A Next.js 15+ app that reloads automatically. Using the pages router.",
    port: 3000,
  },
};

export default templates;
export type Templates = typeof templates;
export type TemplateId = keyof typeof templates;
export type TemplateConfig = (typeof templates)[TemplateId];

export function templatesToPrompt(templates: Templates) {
  return `${Object.entries(templates)
    .map(
      ([id, t], index) =>
        `${index + 1}. ${id}: "${t.instructions}". File: ${t.file || "none"}. Dependencies installed: ${t.lib.join(", ")}. Port: ${t.port || "none"}.`,
    )
    .join("\n")}`;
}
