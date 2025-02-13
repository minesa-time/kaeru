import { readdirSync } from "fs";
import { join } from "path";
import { Client } from "discord.js";

export const loadEvents = (client: Client) => {
    const eventsPath = join(__dirname, "../events");
    const eventFiles = readdirSync(eventsPath).filter((file) =>
        file.endsWith(".ts")
    );

    console.log(`Loading ${eventFiles.length} events...`);

    for (const file of eventFiles) {
        const { default: event } = require(join(eventsPath, file));

        if (!event || !event.name) {
            console.warn(`Skipping invalid event file: ${file}`);
            continue;
        }

        if (event.once) {
            client.once(event.name, (...args) =>
                event.execute(client, ...args)
            );
        } else {
            client.on(event.name, (...args) => event.execute(client, ...args));
        }

        console.log(`✅ Loaded event: ${event.name}`);
    }
};
