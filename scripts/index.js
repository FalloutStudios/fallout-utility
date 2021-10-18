const Prompt = require("prompt-sync");
const Version = require("./modules/version");
const Fs = require("fs");
const Path = require("path");

const modulesDir = Fs.readdirSync(__dirname + '/modules/').filter(file => file.endsWith('.js'));



module.exports = function() {
    this.test = () => { console.log(modulesDir) };

    for (const file of modulesDir) {
        let name = Path.parse(file).name;

        let requireModule = require(__dirname + '/modules/' + file);
        
        try {
            let readyImport = new requireModule();
            this[name] = readyImport;
        } catch (e) {
            this[name] = requireModule;
        }
    }
}