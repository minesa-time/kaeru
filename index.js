import { botLogin } from "./src/config/Configs.js";
import { loadHandlers } from "./src/functions/loadHandlers.js";
import player from "./src/config/music.js";

await loadHandlers();
await botLogin();
