import { DisTube } from "distube";
import { SpotifyPlugin } from "@distube/spotify";
import { client } from "./src/config/Configs.js";

const player = new DisTube(client, {
    emitNewSongOnly: true,
    leaveOnFinish: false,
    leaveOnEmpty: true,
    emptyCooldown: 60,
    emitAddSongWhenCreatingQueue: true,
    plugins: [new SpotifyPlugin()],
});

let queueVarCallback;

player.on("addSong", (queue, song) => {
    let message = `## Added new song\n>>> **Song name:** ${song.name}\n**Song duration:** ${song.formattedDuration}\n__**Requested by:**__ ${song.user}`;
    if (queueVarCallback) {
        queueVarCallback(message);
    }
});

export function waitForQueueVar(callback) {
    queueVarCallback = callback;
}

export default player;
