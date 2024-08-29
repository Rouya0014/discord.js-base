const { EmbedBuilder } = require("discord.js");
const client = require("../../index");
const { bold } = require("chalk");
const { default: mongoose } = require("mongoose");
const config = require("../../config.json");
mongoose.set("strictQuery", false);

module.exports = {
  name: "ready.js",
};

client.once("ready", async () => {
  await mongoose.connect(config.mongodb || "", {
    keepAlive: true,
  });

  if (mongoose.connect) {
    console.log(
      bold.red("[MongoDB] ") + bold.blueBright(`Connecté à MongoDB`)
    );
  }
  console.log(
    bold.green("[Client] ") + bold.blue(`Connecté en tant que ${client.user.tag}`)
  );

})
