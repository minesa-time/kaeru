import {
    ActionRowBuilder,
    PermissionFlagsBits,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    time,
    MessageFlags,
} from "discord.js";
import { lockButton } from "../modals/create-ticket-title.js";
import {
    emoji_ticket_close,
    emoji_ticket_done,
    emoji_ticket_reopen,
    emoji_ticket_stale,
} from "../../shortcuts/emojis.js";
import { defaultPermissionErrorForBot } from "../../shortcuts/permissionErrors.js";

// Ana select menu: Tüm seçeneklerde emoji eklenmiş durumda
const menu3 = new StringSelectMenuBuilder()
    .setCustomId("ticket-select-menu")
    .setDisabled(false)
    .setMaxValues(1)
    .setPlaceholder("Action to close ticket")
    .addOptions(
        new StringSelectMenuOptionBuilder()
            .setLabel("Close as completed")
            .setValue("ticket-menu-done")
            .setDescription("Done, closed, fixed, resolved")
            .setEmoji(emoji_ticket_done)
            .setDefault(false),
        new StringSelectMenuOptionBuilder()
            .setLabel("Close as not planned")
            .setValue("ticket-menu-duplicate")
            .setDescription("Won’t fix, can’t repo, duplicate, stale")
            .setEmoji(emoji_ticket_stale)
            .setDefault(false),
        new StringSelectMenuOptionBuilder()
            .setLabel("Close with comment")
            .setValue("ticket-menu-close")
            .setDescription("Close with a comment")
            .setEmoji(emoji_ticket_close)
            .setDefault(false)
    );

export const row3 = new ActionRowBuilder().addComponents(menu3);

export default {
    data: {
        customId: "ticket-select-menu",
    },

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
                PermissionFlagsBits.ManageThreads
            ) ||
            defaultPermissionErrorForBot(
                interaction,
                PermissionFlagsBits.ViewAuditLog,
                `It is needed to check last state of thread.`
            )
        )
            return;

        const selectedValue = interaction.values[0];
        const formattedTime = time(new Date(), "R");

        switch (selectedValue) {
            case "ticket-menu-close": {
                const modal = new ModalBuilder()
                    .setCustomId("ticket-close-modal")
                    .setTitle("Close Ticket")
                    .addComponents(
                        new ActionRowBuilder().addComponents(
                            new TextInputBuilder()
                                .setCustomId("close-reason")
                                .setLabel("Reason for closing")
                                .setStyle(TextInputStyle.Paragraph)
                                .setRequired(true)
                        )
                    );

                await interaction.showModal(modal);
                break;
            }

            case "ticket-menu-done": {
                await interaction.channel.send({
                    content: `${emoji_ticket_done} **${interaction.user.username}** __closed__ this as completed ${formattedTime}`,
                });

                await interaction.reply({
                    content: `Ticket closed as completed ${formattedTime}`,
                    flags: MessageFlags.Ephemeral
                });

                await interaction.channel.setLocked(true);
                await interaction.channel.setArchived(
                    true,
                    `${interaction.user.username} marked as completed`
                );
                break;
            }

            case "ticket-menu-duplicate": {
                // Yeni select menü: Her seçenek emoji ile gösteriliyor
                const menu2 = new StringSelectMenuBuilder()
                    .setCustomId("ticket-select-menu")
                    .setDisabled(false)
                    .setMaxValues(1)
                    .setPlaceholder("What do you want to do?")
                    .addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel("Re-open ticket")
                            .setValue("ticket-menu-reopen")
                            .setEmoji(emoji_ticket_reopen)
                            .setDefault(false),
                        new StringSelectMenuOptionBuilder()
                            .setLabel("Close as completed")
                            .setValue("ticket-menu-done")
                            .setDescription("Done, closed, fixed, resolved")
                            .setEmoji(emoji_ticket_done)
                            .setDefault(false),
                        new StringSelectMenuOptionBuilder()
                            .setLabel("Close with comment")
                            .setValue("ticket-menu-close")
                            .setDescription("Close with a comment")
                            .setEmoji(emoji_ticket_close)
                    );

                const row2 = new ActionRowBuilder().addComponents(menu2);

                await interaction.update({ components: [row2, lockButton] });

                await interaction.channel.send({
                    content: `${emoji_ticket_stale} **${interaction.user.username}** __closed__ this as not planned ${formattedTime}`,
                });

                await interaction.channel.setArchived(
                    true,
                    `${interaction.user.username} marked as not planned`
                );
                break;
            }

            case "ticket-menu-reopen": {
                await interaction.channel.setArchived(
                    false,
                    `${interaction.user.username} marked as open`
                );

                await interaction.update({ components: [row3, lockButton] });
                break;
            }

            default:
                break;
        }
    },
};
