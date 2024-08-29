const fs = require("fs");
const { bold } = require("chalk");

module.exports = (client) => {
  
  fs.readdirSync('./events/').forEach(dir => {
		const events = fs.readdirSync(`./events/${dir}`).filter(file => file.endsWith('.js'));
		for (let file of events) {
      
			let pull = require(`../events/${dir}/${file}`);
			if (pull.name) {
				client.events.set(pull.name, pull);
			} else {
				console.log(`[Événements] Impossible de charger le fichier ${file}. nom ou alias manquant.`.red)
				continue;
			}
      
		}
	});
	if (client.events.size > 0) console.log(bold.yellowBright("[Événements] ") + bold.magenta(`Chargé ${client.events.size} Événements.`));
}
