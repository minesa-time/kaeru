import {
    time,
    bold,
    PermissionFlagsBits,
    ButtonInteraction,
    ThreadChannel,
} from "discord.js";
import { emojis } from "./emojis";
import { defaultPermissionErrorForBot } from "./permissionErrors";

export async function setLockedAndUpdateMessage(
    interaction: ButtonInteraction,
    reason: string = ""
): Promise<void> {
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
            PermissionFlagsBits.ViewAuditLog
        )
    ) {
        return;
    }

    const formattedTime = time(new Date(), "R");

    if (!(interaction.channel instanceof ThreadChannel)) {
        await interaction.reply({
            content: `${emojis.important} This action can only be performed in a thread channel.`,
            ephemeral: true,
        });
        return;
    }

    await interaction.channel.setLocked(true);

    await interaction.update({
        content: `${emojis.ticketLock} Locked this ticket successfully. To unlock this ticket, please enable it manually using the "unlock" button.`,
        embeds: [],
        components: [],
    });

    await interaction.channel.send({
        content: `${emojis.ticketLock} ${bold(
            interaction.user.username
        )} locked${
            reason ? ` ${reason}` : ""
        } and limited conversation to staff members ${formattedTime}`,
    });
}
