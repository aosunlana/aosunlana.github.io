import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "app", "data", "tools.json");

export interface Tool {
  name: string;
  description: string;
  icon: string;
  logo?: string;
  category: "Design" | "Development" | "Productivity" | "Hardware";
  url?: string;
  usage: string;
  impact: string;
}

export function getTools(): Tool[] {
  try {
    const fileContent = fs.readFileSync(DATA_FILE, "utf-8");
    const tools = JSON.parse(fileContent);
    return tools;
  } catch (error) {
    console.error("Error reading tools data:", error);
    return [];
  }
}
