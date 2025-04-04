import { DisTube } from "distube";
import { SpotifyPlugin } from "@distube/spotify";
import { client } from "./clientConfig.js";
import { emojis } from "../resources/emojis.js";

const player = new DisTube(client, {
    emitNewSongOnly: true,
    leaveOnFinish: false,
    leaveOnEmpty: true,
    emptyCooldown: 60,
    emitAddSongWhenCreatingQueue: true,
    plugins: [
        new SpotifyPlugin({
            parallel: true,
            emitEventsAfterFetching: false,
        }),
    ],
    ytdlOptions: {
        highWaterMark: 1 << 24,
        quality: "highestaudio",
    },
});

let queueVarCallback;

// Song added event
player.on("addSong", (_, song) => {
    let message = `## ${emojis.reactions.reaction_heart} Added new song\n>>> **Song name:** ${song.name}\n**Song duration:** ${song.formattedDuration}\n__**Requested by:**__ ${song.user}`;
    if (queueVarCallback) {
        queueVarCallback(message);
    }
});

// Error handling
player.on("error", (channel, error) => {
    console.error("DisTube error:", error);
    if (channel) {
        channel.send(
            `${emojis.danger} An error occurred: ${
                error.message || "Unknown error"
            }`
        );
    }
});

// Play song event
player.on("playSong", (queue, song) => {
    const channel = queue.textChannel;
    if (channel) {
        channel.send(
            `## ${emojis.reactions.reaction_heart} Now playing\n>>> **Song name:** ${song.name}\n**Song duration:** ${song.formattedDuration}\n__**Requested by:**__ ${song.user}`
        );
    }
});

// Empty channel event
player.on("empty", (channel) => {
    if (channel) {
        channel.send(
            `${emojis.info} Voice channel is empty! Leaving the channel...`
        );
    }
});

export function waitForQueueVar(callback) {
    queueVarCallback = callback;
}

export default player;
