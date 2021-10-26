/*

        dMMMMMP .aMMMb  dMP     dMP    .aMMMb  dMP dMP dMMMMMMP        dMP dMP dMMMMMMP dMP dMP 
       dMP     dMP"dMP dMP     dMP    dMP"dMP dMP dMP    dMP          dMP dMP    dMP   amr dMP  
      dMMMP   dMMMMMP dMP     dMP    dMP dMP dMP dMP    dMP          dMP dMP    dMP   dMP dMP   
     dMP     dMP dMP dMP     dMP    dMP.aMP dMP.aMP    dMP          dMP.aMP    dMP   dMP dMP    
    dMP     dMP dMP dMMMMMP dMMMMMP VMMMP"  VMMMP"    dMP           VMMMP"    dMP   dMP dMMMMMP

*/
const Fs = require("fs");
const Path = require("path");

const modulesDir = Fs.readdirSync(__dirname + '/scripts/').filter(file => file.endsWith('.js'));


module.exports = new Create();

function Create() {
    for (const file of modulesDir) {
        let name = Path.parse(file).name;
        
        
        let requireModule = require(__dirname + '/scripts/' + file);
        this[name] = requireModule;
    }
}