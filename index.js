import chalk from "chalk";
import figlet from "figlet";
import * as emoji from 'node-emoji'


// Greet

console.log(
    figlet.textSync("Rstudio Provisioner!", {
      font: "Standard",
      horizontalLayout: "default",
      verticalLayout: "default",
      width: 100,
    //   whitespaceBreak: true,
    })
  );

  console.log(chalk.bgGreen.bold("Hi There!"))
  console.log(emoji.find(':pizza'))
// List available r versions
// ask for the password to set for the rstudio
// show spinner - untill provisioned
// Give back the URL
