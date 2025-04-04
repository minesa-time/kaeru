import {
    InteractionContextType,
    PermissionFlagsBits,
    SlashCommandBuilder,
    bold,
} from "discord.js";
import { defaultPermissionErrorForBot } from "../../resources/permissionErrors.js";
import { emojis } from "../../resources/emojis.js";
import player, { waitForQueueVar } from "../../config/music.js";
import { DisTubeError } from "distube";
import { genres } from "../../resources/genres.js";

export default {
    data: new SlashCommandBuilder()
        .setName("music")
        .setDescription("Music! ☕️")
        .setContexts([InteractionContextType.Guild])
        .setDefaultMemberPermissions(PermissionFlagsBits.Connect)
        .addSubcommandGroup((subcommandGroup) =>
            subcommandGroup
                .setName("play")
                .setDescription("Play music!")
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("foryou")
                        .setDescription(
                            "Pick, feel, play. Never been this easy!"
                        )
                        .addStringOption((option) =>
                            option
                                .setName("list")
                                .setNameLocalizations({
                                    tr: "liste",
                                    it: "lista",
                                    "zh-CN": "列表",
                                    el: "κατάλογος",
                                    "pt-BR": "lista",
                                    ro: "listă",
                                })
                                .setDescription(
                                    "Lists update weekly. Stay tuned!"
                                )
                                .setDescription(
                                    "Lists update weekly. Stay tuned!"
                                )
                                .setDescriptionLocalizations({
                                    tr: "Listeler haftalık olarak güncellenir. Takipte kalın!",
                                    it: "Le liste vengono aggiornate settimanalmente. Resta sintonizzato!",
                                    "zh-CN": "列表每周更新。 敬请关注！",
                                    el: "Οι λίστες ενημερώνονται εβδομαδιαία. Μείνετε συντονισμένοι!",
                                    "pt-BR":
                                        "Listas atualizam semanalmente. Fique ligado!",
                                    ro: "Listele se actualizează săptămânal. Rămâneți conectat!",
                                })
                                .setRequired(true)
                                .addChoices(
                                    {
                                        name: "Geleneksel Pop Müziği",
                                        value: "traditional_pop",
                                        name_localizations: {
                                            tr: "Geleneksel Pop Müziği",
                                            it: "Musica pop tradizionale",
                                            "zh-CN": "传统流行音乐",
                                            el: "Παραδοσιακή pop μουσική",
                                            "pt-BR": "Música pop tradicional",
                                            ro: "Muzică pop tradițională",
                                        },
                                    },
                                    {
                                        name: "Rock",
                                        value: "rock",
                                        name_localizations: {
                                            tr: "Rock",
                                            it: "Rock classico",
                                            "zh-CN": "经典摇滚音乐",
                                            el: "Κλασική ροκ μουσική",
                                            "pt-BR": "Rock clássico",
                                            ro: "Rock clasic",
                                        },
                                    },
                                    {
                                        name: "Hip-Hop/Rap",
                                        value: "hip_hop_rap",
                                        name_localizations: {
                                            tr: "Hip-Hop/Rap",
                                            it: "Musica Hip-Hop/Rap",
                                            "zh-CN": "嘻哈/说唱音乐",
                                            el: "Μουσική Hip-Hop/Rap",
                                            "pt-BR": "Música Hip-Hop/Rap",
                                            ro: "Muzică Hip-Hop/Rap",
                                        },
                                    },
                                    {
                                        name: "R&B",
                                        value: "rnb",
                                        name_localizations: {
                                            tr: "R&B",
                                            it: "Musica R&B",
                                            "zh-CN": "节奏蓝调音乐",
                                            el: "Μουσική R&B",
                                            "pt-BR": "Música R&B",
                                            ro: "Muzică R&B",
                                        },
                                    },
                                    {
                                        name: "Dance",
                                        value: "dance",
                                        name_localizations: {
                                            tr: "Dans",
                                            it: "Musica dance",
                                            "zh-CN": "电子舞曲",
                                            el: "Ηλεκτρονική μουσική χορού",
                                            "pt-BR":
                                                "Música eletrônica de dança",
                                            ro: "Muzică electronică de dans",
                                        },
                                    },
                                    {
                                        name: "K-Pop",
                                        value: "kpop",
                                        name_localizations: {
                                            tr: "K-Pop",
                                            it: "Musica K-Pop",
                                            "zh-CN": "韩国流行音乐",
                                            el: "Κορεατική pop μουσική",
                                            "pt-BR": "Música pop coreana",
                                            ro: "Muzică pop coreeană",
                                        },
                                    },
                                    {
                                        name: "Metal",
                                        value: "metal",
                                        name_localizations: {
                                            tr: "Metal",
                                            it: "Musica metal",
                                            "zh-CN": "重金属音乐",
                                            el: "Μουσική heavy metal",
                                            "pt-BR": "Música heavy metal",
                                            ro: "Muzică heavy metal",
                                        },
                                    },
                                    {
                                        name: "Classical",
                                        value: "classical",
                                        name_localizations: {
                                            tr: "Klasik",
                                            it: "Musica classica",
                                            "zh-CN": "古典音乐",
                                            el: "Κλασική μουσική",
                                            "pt-BR": "Música clássica",
                                            ro: "Muzică clasică",
                                        },
                                    },
                                    {
                                        name: "Jazz",
                                        value: "jazz",
                                        name_localizations: {
                                            tr: "Caz",
                                            it: "Musica jazz",
                                            "zh-CN": "爵士音乐",
                                            el: "Τζαζ μουσική",
                                            "pt-BR": "Música jazz",
                                            ro: "Muzică jazz",
                                        },
                                    },
                                    {
                                        name: "Electronic",
                                        value: "electronic",
                                        name_localizations: {
                                            tr: "Elektronik",
                                            it: "Musica elettronica",
                                            "zh-CN": "电子音乐",
                                            el: "Ηλεκτρονική μουσική",
                                            "pt-BR": "Música eletrônica",
                                            ro: "Muzică electronică",
                                        },
                                    },
                                    {
                                        name: "Love",
                                        value: "love",
                                        name_localizations: {
                                            tr: "Aşk",
                                            it: "Canzoni d'amore",
                                            "zh-CN": "情歌",
                                            el: "Τραγούδια αγάπης",
                                            "pt-BR": "Canções de amor",
                                            ro: "Cântece de dragoste",
                                        },
                                    },
                                    {
                                        name: "Broken Heart",
                                        value: "broken_heart",
                                        name_localizations: {
                                            tr: "Kalp Kırıklığı",
                                            it: "Canzoni di rottura",
                                            "zh-CN": "心碎歌曲",
                                            el: "Τραγούδια καρδιακής απογοήτευσης",
                                            "pt-BR": "Canções de desgosto",
                                            ro: "Cântece de inimă frântă",
                                        },
                                    },
                                    {
                                        name: "Chill",
                                        value: "chill",
                                        name_localizations: {
                                            tr: "Rahatlatıcı",
                                            it: "Musica chillout",
                                            "zh-CN": "放松音乐",
                                            el: "Χαλαρή μουσική",
                                            "pt-BR": "Música relaxante",
                                            ro: "Muzică relaxantă",
                                        },
                                    }
                                )
                        )
                )
        )
        .addSubcommandGroup((subcommandGroup) =>
            subcommandGroup
                .setName("control")
                .setDescription("Control music :3")
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("autoplay")
                        .setDescription("Let just me play music for ya!")
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("skip")
                        .setDescription("Let's skip this. I aggreeee!")
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("playing")
                        .setDescription("What is this track's name? 👀")
                )
        ),
    execute: async ({ interaction }) => {
        if (
            defaultPermissionErrorForBot(
                interaction,
                PermissionFlagsBits.ViewChannel
            ) ||
            defaultPermissionErrorForBot(
                interaction,
                PermissionFlagsBits.UseExternalEmojis
            ) ||
            defaultPermissionErrorForBot(
                interaction,
                PermissionFlagsBits.SendMessages
            ) ||
            defaultPermissionErrorForBot(
                interaction,
                PermissionFlagsBits.AttachFiles
            ) ||
            defaultPermissionErrorForBot(
                interaction,
                PermissionFlagsBits.Connect
            ) ||
            defaultPermissionErrorForBot(interaction, PermissionFlagsBits.Speak)
        )
            return;

        await interaction.deferReply();

        const { options, member, guild, channel } = interaction;
        const subgroup = options.getSubcommandGroup();
        const subcommand = options.getSubcommand();

        const list = options.getString("list");
        const voiceChannel = member.voice.channel;
        const queue = player.getQueue(guild);

        const botVoiceChannelId = guild.members.me.voice.channelId;
        if (!voiceChannel) {
            return interaction.editReply({
                content: `${emojis.danger} You are not in a voice channel!`,
            });
        }
        if (botVoiceChannelId && member.voice.channelId !== botVoiceChannelId) {
            return interaction.reply({
                content: `${emojis.danger} The music player is already active in <#${guild.members.me.voice.channelId}>`,
                ephemeral: true,
            });
        }

        switch (subgroup) {
            case "play":
                switch (subcommand) {
                    case "foryou":
                        const artists = genres[list];
                        const randomArtist =
                            artists[Math.floor(Math.random() * artists.length)];

                        try {
                            await interaction.editReply({
                                content: `${emojis.info} Searching for music... This may take a moment.`,
                            });

                            player
                                .play(voiceChannel, randomArtist.query, {
                                    textChannel: channel,
                                    member: member,
                                })
                                .catch((error) => {
                                    console.error("Music error:", error);
                                    if (
                                        error instanceof DisTubeError &&
                                        error.message === "NOT_SUPPORTED_URL"
                                    ) {
                                        return interaction.followUp({
                                            content: `${emojis.danger} The provided URL is not supported.`,
                                        });
                                    } else {
                                        return interaction.followUp({
                                            content: `${
                                                emojis.danger
                                            } An error occurred while playing music: ${
                                                error.message || "Unknown error"
                                            }`,
                                        });
                                    }
                                });
                        } catch (error) {
                            console.error("Music command error:", error);
                            return interaction.followUp({
                                content: `${
                                    emojis.danger
                                } An unexpected error occurred: ${
                                    error.message || "Unknown error"
                                }`,
                            });
                        }

                        waitForQueueVar((queueVarMessage) => {
                            setTimeout(() => {
                                return interaction.followUp({
                                    content: `${queueVarMessage}`,
                                    allowedMentions: { parse: [] },
                                });
                            }, 1000);
                        });
                        break;
                }
                break;

            case "control":
                if (!queue) {
                    return interaction.reply({
                        content: `${emojis.info} There is no queue.`,
                    });
                }

                switch (subcommand) {
                    case "autoplay":
                        const autoplay = queue.toggleAutoplay();

                        await interaction.editReply({
                            content: `${
                                emojis.reactions.reaction_emphasize
                            } Autoplay is ${
                                autoplay ? bold("on") : bold("off")
                            } now.`,
                        });
                        break;
                    case "skip":
                        try {
                            const skippedTrack = queue.skip();
                            return interaction.editReply({
                                content: `# ${
                                    emojis.up
                                } Skipping to new track\n> Now playing: ${bold(
                                    (await skippedTrack).name
                                )}`,
                            });
                        } catch (error) {
                            if (
                                error instanceof DisTubeError &&
                                error.code === "NO_UP_NEXT"
                            ) {
                                return interaction.followUp({
                                    content: `${emojis.danger} There is no up next song to skip, eh. End of the list?`,
                                });
                            }
                        }
                        break;
                    case "playing":
                        const playedTrack = queue.songs[0];
                        const file = playedTrack.thumbnail || "";

                        await interaction.editReply({
                            content: `## ${emojis.reactions.reaction_heart} Playing\n>>> **Song name:** ${playedTrack.name}\n**Song duration:** ${playedTrack.formattedDuration}\n__**Added by:**__ ${playedTrack.user}`,
                            files: [file],
                            allowedMentions: { parse: [] },
                        });
                        break;
                }
                break;
            default:
                break;
        }
    },
};
