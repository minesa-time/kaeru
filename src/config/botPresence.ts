import { ActivityType, PresenceData, PresenceUpdateStatus } from "discord.js";

export const botPresence: PresenceData = {
    status: PresenceUpdateStatus.Online,
    activities: [
        {
            name: "Pro-tickets",
            type: ActivityType.Playing,
            state: "Serving Pro-tickets for your community",
        },
    ],
};
