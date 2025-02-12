const { SlashCommandBuilder, PermissionFlagsBits, InteractionContextType } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('viewinv')
		.setDescription('View the inventory of a user.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to view the inventory of.')
                .setRequired(true)
            )
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers)
        .setContexts(InteractionContextType.Guild),
	async execute(interaction, db) {
        const target = interaction.options.getUser('user');
        var discordId = target.id;

        const [rows] = await db.execute("SELECT * FROM players WHERE discord = ?", [discordId]);

        console.log(target.id);

        // check if target has entry in DB
        if (rows.length === 0) {
            return interaction.reply({ content: "User not found in database!", ephemeral: true });
        } else {
            return interaction.reply({ content: "License: " + rows[0].license});
        }
	},
};