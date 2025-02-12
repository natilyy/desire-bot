const { SlashCommandBuilder, PermissionFlagsBits, InteractionContextType, EmbedBuilder, MessageFlags } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('viewinfo')
		.setDescription("View a player's information")
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The target player')
                .setRequired(true)
            )
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers)
        .setContexts(InteractionContextType.Guild),
	async execute(interaction, db) {
        const target = interaction.options.getUser('user');
        var discordId = target.id;

        const [rows] = await db.execute("SELECT * FROM players WHERE discord = ?", [discordId]);

        // check if target has entry in DB
        if (rows.length === 0) {
            return interaction.reply({ content: "User not found in database - please ping <@530740868358078494> for help!",  flags: MessageFlags.Ephemeral });
        } else {
            const embeds = [];
            for (let i = 0; i < rows.length; i++) {
                let data = rows[i];
                let citizenid = data.citizenid;

                let charinfo = JSON.parse(data.charinfo);
                let name = charinfo.firstname + " " + charinfo.lastname;

                let currentJob = JSON.parse(data.job);
                let currentGrade = currentJob.grade;
                let description = "__Job__\n```" + currentJob.name + ", grade: " + currentGrade.level + "```\n";

                const [jobs] = await db.execute("SELECT * FROM multijobs WHERE citizenid = ?", [citizenid]);

                if (jobs.length > 0) {
                    description += "__Other Jobs__```";
                    let multiJob = JSON.parse(jobs[0].jobdata);
                    for (let [key, value] of Object.entries(multiJob)) {
                        description += "\n" + key + ", grade: " + value;
                    }
                    description += "```\n";
                }
                

                let money = JSON.parse(data.money);

                description += "__Money__ \n```Cash: $" + money.cash + "\nBank: $" + money.bank + "```\n__Inventory__\n```";

                let inventory = JSON.parse(data.inventory);

                if (inventory.length === 0) {
                    description += "Empty";
                } 

                for (let j = 0; j < inventory.length; j++) {
                    let item = inventory[j];
                    description += "\n" + item.name + ": " + item.count;
                    if (item.metadata != null) {
                        description += " (" + JSON.stringify(item.metadata) + ")";
                    }
                }

                description += "```";

                const embed = new EmbedBuilder()
                .setColor('ae47ff')
                .setTitle(name)
                .setDescription(description);

                embeds.push(embed);
            }
            return interaction.reply({
                content: "Information of: " + target.displayName, 
                embeds: embeds
            });
        }
	},
};