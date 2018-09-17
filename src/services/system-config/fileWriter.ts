import * as fsWriter from 'fs-extra'

export function writeToConfig(config: Object){
  fsWriter.writeJson('src/assets/resources/configValues.json', config, function(err){
    if(err){
      console.log(err);
    } else {
      console.log("The file was saved!")
    }
  });
}
