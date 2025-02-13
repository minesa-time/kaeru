import { client } from "./export";
import dotenv from "dotenv";

dotenv.config();

export const botLogin = async () => {
    console.log("Logging in...");

    try {
        await client.login(process.env.BOT_TOKEN);
        console.log("Bot logged in successfully.");
    } catch (error) {
        console.error("Failed to log in:", error);
    }
};
