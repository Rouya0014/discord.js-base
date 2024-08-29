const fs = require("fs");
const { bold } = require("chalk");

module.exports = (client, config) => {

    const modals = fs.readdirSync(`./modals/`).filter(file => file.endsWith('.js'));

    for (let file of modals) {

        let pull = require(`../modals/${file}`);
        if (pull.id) {
            client.modals.set(pull.id, pull);
        } else {
            console.log(`[Modales] Impossible de charger le fichier ${file}. ID modal manquant..`.red)
            continue;
        }
    }
    if (client.modals.size > 0) console.log(bold.cyanBright("[Modales] ") + bold.yellowBright(`Chargé ${client.modals.size} Modales.`));
};
