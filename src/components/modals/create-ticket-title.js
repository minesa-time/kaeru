import {
    ChannelType,
    ActionRowBuilder,
    EmbedBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionFlagsBits,
    roleMention,
    MessageFlags,
} from "discord.js";
import {
    emoji_ticket_lock,
    emoji_doorEnter,
    emoji_ticket_done,
    emoji_ticket_stale,
    emoji_ticket_close,
    emoji_ticketCreated,
    emoji_danger,
} from "../../shortcuts/emojis.js";
import { defaultPermissionErrorForBot } from "../../shortcuts/permissionErrors.js";
import { getStaffRoleId } from "../../shortcuts/database.js";
import {
    emoji_bugLabel,
    emoji_rewardLabel,
    emoji_questionLabel,
    emoji_discussionLabel,
    emoji_helpLabel,
} from "../../shortcuts/emojis.js";

let lockButton = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
        .setCustomId("ticket-lock-conversation")
        .setLabel("Lock Ticket")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(false)
        .setEmoji(emoji_ticket_lock)
);

export default {
    data: {
        customId: "create-ticket-modal",
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
                PermissionFlagsBits.EmbedLinks
            ) ||
            defaultPermissionErrorForBot(
                interaction,
                PermissionFlagsBits.CreatePrivateThreads,
                `Please contact with a staff member saying "Kaeru can't create private thread due permission is missing".`
            ) ||
            defaultPermissionErrorForBot(
                interaction,
                PermissionFlagsBits.SendMessagesInThreads,
                `${emoji_danger} Kaeru can't create the thread and add you to thread to send message to there. Please contact with a staff member. This has to be fixed.`
            )
        )
            return;

        const ticketTitle =
            interaction.fields.getTextInputValue("ticket-title");

        const embed = new EmbedBuilder()
            .setTitle(`${emoji_doorEnter} Now, we did it. Here we are!`)
            .setDescription(
                "Our staff member(s) will take care of this thread sooner. While they are on their way, why don’t you talk about your ticket?"
            )
            .setThumbnail(
                "https://cdn.discordapp.com/attachments/736571695170584576/1327617435418755185/23679.png?ex=67923816&is=6790e696&hm=20665b7edede15c92383a8411ae23827dac2ff732bdf3afb5161f752e7426dc5&"
            );

        // Updated select menu with unique option values
        const menu = new StringSelectMenuBuilder()
            .setCustomId("ticket-select-menu")
            .setDisabled(false)
            .setMaxValues(1)
            .setPlaceholder("Action to close ticket")
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel("Close as completed")
                    .setValue("ticket-menu-done") // Changed from "ticket-menu-close" to "ticket-menu-done"
                    .setDescription("Done, closed, fixed, resolved")
                    .setEmoji(emoji_ticket_done)
                    .setDefault(false),
                new StringSelectMenuOptionBuilder()
                    .setLabel("Close as not planned")
                    .setValue("ticket-menu-duplicate")
                    .setDescription("Won’t fix, can’t repo, duplicate, stale")
                    .setEmoji(emoji_ticket_stale),
                new StringSelectMenuOptionBuilder()
                    .setLabel("Close with comment")
                    .setValue("ticket-menu-close")
                    .setDescription("Close with a comment")
                    .setEmoji(emoji_ticket_close)
            );

        const labelMenu = new StringSelectMenuBuilder()
            .setCustomId("ticket-label-menu")
            .setPlaceholder("Select labels for this ticket")
            .setMinValues(1)
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel("Bug")
                    .setValue("label-bug")
                    .setEmoji(emoji_bugLabel),
                new StringSelectMenuOptionBuilder()
                    .setLabel("Reward")
                    .setValue("label-reward")
                    .setEmoji(emoji_rewardLabel),
                new StringSelectMenuOptionBuilder()
                    .setLabel("Question")
                    .setValue("label-question")
                    .setEmoji(emoji_questionLabel),
                new StringSelectMenuOptionBuilder()
                    .setLabel("Discussion")
                    .setValue("label-discussion")
                    .setEmoji(emoji_discussionLabel),
                new StringSelectMenuOptionBuilder()
                    .setLabel("Help")
                    .setValue("label-help")
                    .setEmoji(emoji_helpLabel)
            );

        const menuRow = new ActionRowBuilder().addComponents(menu);
        const labelMenuRow = new ActionRowBuilder().addComponents(labelMenu);

        let thread = await interaction.channel.threads.create({
            name: `${ticketTitle}`,
            autoArchiveDuration: 1440,
            type: ChannelType.PrivateThread,
            reason: `${interaction.user.username} opened a thread for support`,
            invitable: false,
        });

        await interaction.reply({
            content: `# ${emoji_ticketCreated} Created <#${thread.id}>\nNow, you can talk about your issue with our staff members.`,
            flags: MessageFlags.Ephemeral,
        });

        const staffRoleId = await getStaffRoleId(interaction.guild.id);

        let pinMessage = await thread.send({
            content: `${roleMention(staffRoleId)}`,
            embeds: [embed],
            components: [menuRow, labelMenuRow, lockButton],
        });

        await thread.members.add(interaction.user);
        if (
            interaction.guild.members.me.permissions.has(
                PermissionFlagsBits.ManageMessages
            )
        )
            await pinMessage.pin();
        else return;
    },
};

export { lockButton };
