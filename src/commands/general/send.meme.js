import {
    ApplicationIntegrationType,
    InteractionContextType,
    SlashCommandBuilder,
} from "discord.js";
import { emojis } from "../../functions/emojis.js";

export default {
    data: new SlashCommandBuilder()
        .setName("send-meme")
        .setDescription("Memes from my pocket")
        .setNameLocalizations({
            it: "meme",
            tr: "mim",
            ro: "meme",
            el: "μεμέ",
            "pt-BR": "meme",
            ChineseCN: "梗图",
        })
        .setDescriptionLocalizations({
            tr: "Cebimden gelen mimler",
            it: "Meme dalla mia tasca",
            el: "Μεμέδες από την τσέπη μου",
            ro: "Meme-uri din buzunarul meu",
            "pt-BR": "Memês do meu bolso",
            ChineseCN: "口袋里的梗图",
        })
        .setIntegrationTypes([
            ApplicationIntegrationType.UserInstall,
            ApplicationIntegrationType.GuildInstall,
        ])
        .setContexts([
            InteractionContextType.BotDM,
            InteractionContextType.PrivateChannel,
            InteractionContextType.Guild,
        ]),
    execute: async ({ interaction }) => {
        await interaction.deferReply();
        const API = await fetch("https://apis.duncte123.me/meme", {
            method: "GET",
        });
        const RESPONSE = await API.json();

        await interaction.editReply({
            content: `# ${emojis.brain} ${RESPONSE.data.title}\n> ${RESPONSE.data.image}`,
        });
    },
};
