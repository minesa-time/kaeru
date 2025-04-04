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
    plugins: [new SpotifyPlugin()],
});

let queueVarCallback;

player.on("addSong", (_, song) => {
    let message = `## ${emojis.reactions.reaction_heart} Added new song\n>>> **Song name:** ${song.name}\n**Song duration:** ${song.formattedDuration}\n__**Requested by:**__ ${song.user}`;
    if (queueVarCallback) {
        queueVarCallback(message);
    }
});

export function waitForQueueVar(callback) {
    queueVarCallback = callback;
}

export default player;
