import { Events, Client } from "discord.js";
import { botPresence } from "../config/botPresence";

export default {
    name: Events.ClientReady,
    once: true,
    execute(client: Client) {
        if (!client.user) {
            console.error("Error: client.user is null.");
            return;
        }

        client.user.setPresence(botPresence);
        console.log(`${client.user.tag} is online!`);
    },
};
