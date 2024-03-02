require('dotenv').config();
const {writeFileSync, mkdirSync} = require('fs')
const targetPath = `./src/environments/environment.ts`;
const envFileContent = `
  export const environment = {
    mapbox_key: "${process.env.MAPBOX_KEY}",
  };
`;
//Intruccion para crear el archivo en caso de que no exista con node
mkdirSync('./src/environments', {recursive: true});
writeFileSync( targetPath, envFileContent, );
