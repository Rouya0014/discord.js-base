const { Client, Partials, Collection, GatewayIntentBits } = require('discord.js');
const config = require('./config.json');

const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.AutoModerationConfiguration,
    GatewayIntentBits.AutoModerationExecution
  ],
  partials: [
    Partials.Channel,
    Partials.Message,
    Partials.User,
    Partials.GuildMember,
    Partials.Reaction
  ],
  presence: {
    activities: [{
      name: "discord",
      type: 0
    }],
    status: 'online'
  }
});


require('http').createServer((req, res) => res.end('Ready.')).listen(3000);

const AuthenticationToken = config.token
if (!AuthenticationToken) {
  console.warn("[CRASH] Un jeton d'authentification pour le bot Discord est requis ! Utilisez Envrionment Secrets ou config.json.".red)
  return process.exit();
};

client.prefix_commands = new Collection();
client.slash_commands = new Collection();
client.user_commands = new Collection();
client.message_commands = new Collection();
client.modals = new Collection();
client.events = new Collection();

module.exports = client;

["prefix", "application_commands", "modals", "events"].forEach((file) => {
  require(`./handlers/${file}`)(client, config);
});


client.login(AuthenticationToken)
  .catch((err) => {
    console.error("[CRASH] Une erreur s'est produite lors de la connexion à votre bot...");
    console.error("[CRASH] Erreur de l'API Discord :" + err);
    return process.exit();
  });

process.on('unhandledRejection', async (err, promise) => {
  console.error(`[ANTI-CRASH] Unhandled Rejection: ${err}`.red);
  console.error(promise);
});
