import db from "@repo/database";
import { themesTable } from "@repo/database/models/theme";

export const PRESET_THEMES = [
  { id: "aurora", name: "Aurora", primaryColor: "#ec4899", backgroundColor: "#0f172a", textColor: "#f8fafc", cardStyle: "glass", fontFamily: "Inter", isPreset: true },
  { id: "sakura", name: "Sakura", primaryColor: "#f43f5e", backgroundColor: "#fff1f2", textColor: "#881337", cardStyle: "bordered", fontFamily: "Inter", isPreset: true },
  { id: "kyoto", name: "Kyoto", primaryColor: "#059669", backgroundColor: "#ecfdf5", textColor: "#064e3b", cardStyle: "shadow", fontFamily: "Roboto", isPreset: true },
  { id: "zen", name: "Zen", primaryColor: "#6366f1", backgroundColor: "#fafafa", textColor: "#18181b", cardStyle: "minimal", fontFamily: "Inter", isPreset: true },
  { id: "cyberpunk", name: "Cyberpunk", primaryColor: "#00f0ff", backgroundColor: "#09090b", textColor: "#f4f4f5", cardStyle: "neon", fontFamily: "Outfit", isPreset: true },
];

class ThemeService {
  public async listThemes() {
    const dbThemes = await db.select().from(themesTable);
    return [...PRESET_THEMES, ...dbThemes];
  }
}

export default new ThemeService();
