import {
    ActionRowBuilder,
    EmbedBuilder,
    MessageFlags,
    PermissionFlagsBits,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    bold,
} from "discord.js";
import { defaultPermissionErrorForBot } from "../../functions/permissionErrors.js";
import { emojis } from "../../resources/emojis.js";

export default {
    data: {
        customId: "ticket-lock-conversation",
    },
    execute: async ({ interaction }) => {
        if (
            !interaction.member.permissions.has(
                PermissionFlagsBits.ManageThreads
            )
        )
            return interaction.reply({
                content: `${emojis.important} You don't have ${bold(
                    "Manage Threads"
                )} permission to do this action, <@${interaction.user.id}>.`,
                flags: MessageFlags.Ephemeral,
            });

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
                PermissionFlagsBits.ManageThreads
            )
        )
            return;

        const lockButtonExplanation = new EmbedBuilder()
            .setTitle("Lock conversation on this ticket")
            .setThumbnail(
                "https://media.discordapp.net/attachments/736571695170584576/1327617955063791710/75510.png?ex=67850992&is=6783b812&hm=aeef5a062a566fa7d467752ce9f16f2a7932a655342ae048f6a1e4ef379fa10b&=&width=934&height=934"
            )
            .setDescription(
                `* Other user(s) can’t add new comments to this ticket.\n* You and other moderators with access to this channel can still leave comments that others can see.\n* You can always unlock this ticket again in the future.`
            )
            .setFooter({
                text: "Optionally, choose a reason for locking that others can see.",
            });

        const lockReasonsMenu = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId("ticket-lock-reason")
                .setDisabled(false)
                .setMaxValues(1)
                .setPlaceholder("Choose a reason")
                .addOptions(
                    new StringSelectMenuOptionBuilder()
                        .setLabel("Other")
                        .setValue("ticket-lock-reason-other"),
                    new StringSelectMenuOptionBuilder()
                        .setLabel("Off-topic")
                        .setValue("ticket-lock-reason-off-topic"),
                    new StringSelectMenuOptionBuilder()
                        .setLabel("Too heated")
                        .setValue("ticket-lock-reason-too-heated"),
                    new StringSelectMenuOptionBuilder()
                        .setLabel("Resolved")
                        .setValue("ticket-lock-reason-resolved"),
                    new StringSelectMenuOptionBuilder()
                        .setLabel("Spam")
                        .setValue("ticket-lock-reason-spam")
                )
        );

        await interaction.reply({
            embeds: [lockButtonExplanation],
            components: [lockReasonsMenu],
            flags: MessageFlags.Ephemeral,
        });
    },
};
