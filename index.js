import chalk from "chalk";
import figlet from "figlet";
import * as emoji from 'node-emoji'
import {select, Separator, input} from "@inquirer/prompts";
import {spawn} from "child_process";
import { createSpinner } from 'nanospinner'


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
  // console.log(emoji.find(':pizza'))

let answer = await getRversion();
console.log(answer)

let password = await getPassword();
console.log(password)


// List available r versions
async function getRversion(){
  const answer = await select({
    message: 'Select a package manager',
    choices: [
      {
        name: 'r4.1',
        value: 'R v4.1',
        description: 'npm is the most popular package manager',
      },
      {
        name: 'r3.6.3',
        value: 'R v3.6',
        description: 'yarn is an awesome package manager',
      },
    ]
  });
  return answer
}

// ask for the password to set for the rstudio
async function getPassword(){
  const password= await input({message: 'Enter a new password (min: 3 chars)', required: true, validate: (input_pass)=>{
    if (input_pass.length > 3){
      return true
    }
    else return false 
  }})
  return password
}

// show spinner - untill provisioned
const spinner = createSpinner('Provisioning a Rstudio').start()

setTimeout(() => {
  spinner.success()
}, 5000)



// Give back the URL
