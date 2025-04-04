export function defaultPermissionErrorForBot(interaction, permission) {
    const hasPermission = interaction.guild.members.me.permissions.has(permission);
    if (!hasPermission) {
        interaction.reply({
            content: `I don't have the required permission to execute this command.`,
            ephemeral: true,
        });
        return true;
    }
    return false;
}
