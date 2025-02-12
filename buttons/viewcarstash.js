const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "viewcarstash",
    async execute(interaction, db) {
        const citizenid = interaction.customId.split("_")[1]; // Extract citizenid from button ID

        const [cars] = await db.execute("SELECT * FROM player_vehicles WHERE citizenid = ?", [citizenid]);

        if (cars.length === 0) {
            return interaction.reply({ content: "No cars found for this user.", flags: MessageFlags.Ephemeral });
        } else {
            const embeds = [];

            for (let i = 0; i < cars.length; i++) {
                let data = cars[i];
                let plate = data.plate;

                let description = "";

                description += "__Glovebox__\n```";

                if (data.glovebox === null) {
                    description += "Empty";
                } else {
                    let glovebox = JSON.parse(data.glovebox);
                    if (glovebox.length === 0) {
                        description += "Empty";
                    }
    
                    for (let j = 0; j < glovebox.length; j++) {
                        description += glovebox[j].name + ": " + glovebox[j].count + "\n";
                    }
                }

                description += "```\n__Trunk__\n```";

                if (data.trunk === null) {
                    description += "Empty";
                } else {
                    let trunk = JSON.parse(data.trunk);
                    if (trunk.length === 0) {
                        description += "Empty";
                    }
    
                    for (let j = 0; j < trunk.length; j++) {
                        description += trunk[j].name + ": " + trunk[j].count + "\n";
                    }
                }

                description += "```";

                embeds.push({
                    color: 0xae47ff,
                    title: plate,
                    description: description
                });
            }

            return interaction.reply({
                embeds: embeds
            });
        }
    }
};