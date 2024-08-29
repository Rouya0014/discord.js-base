const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const client = require("../../index");
const config = require("../../config.json");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  name: "messageCreate"
};

client.on('messageCreate', async (message) => {

 if (message.channel.type !== 0 || message.author.bot) return;

  const prefix = await db.get(`guild_prefix_${message.guild.id}`) || config.Prefix || "!";

  if (!message.content.startsWith(prefix)) return;

  if (!message.member) message.member = await message.guild.members.fetch(message.author.id);

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();
  if (cmd.length === 0) return;

  let command = client.prefix_commands.get(cmd);

  if (!command) return;

  if (command) {
    if (command.permissions) {
      if (!message.member.permissions.has(PermissionsBitField.resolve(command.permissions || []))) {
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(`Vous n'avez pas la permission d'utiliser cette commande.`)
              .setColor("#ee2346")
          ], ephemeral: true
        });
      }
    }

    if (command.owner) {
      if (config?.OWNERS) {
        const allowedUsers = config.OWNERS.map(userId => {
          const member = message.guild.members.cache.get(userId);
          return member ? member.username : '*Utilisateur inconnu*';
        });

        if (!config.OWNERS.includes(message.member.id)) {
          return message.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(`Désolé mais seuls les propriétaires peuvent utiliser cette commande ! Utilisateurs autorisés :\n**${allowedUsers.join(", ")}**`)
                .setColor("#ee2346")
            ], ephemeral: true
          });
        }
      }
    }

    try {
      await command.run(client, message, args, prefix, config, db);
    } catch (error) {
      console.error(error);
    }
  }
});
