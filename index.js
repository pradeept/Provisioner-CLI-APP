#!/usr/bin/env node

import chalk from "chalk";
import figlet from "figlet";
import { select, Separator, input } from "@inquirer/prompts";
import { createSpinner } from "nanospinner";
import { Client } from "ssh2";

// Greet
console.log(
  figlet.textSync("Rstudio Provisioner!", {
    font: "Standard",
    horizontalLayout: "default",
    verticalLayout: "default",
    width: 100,
  })
);

console.log(chalk.bgGreen.bold("Hi There!"));


let RVERSION = await getRversion();
console.log(RVERSION);

let RPASSWORD = await getPassword();
console.log(RPASSWORD);

new Separator();

// List available r versions
async function getRversion() {
  const answer = await select({
    message: "Select a package manager",
    choices: [
      {
        name: "Latest",
        value: "latest",
        description: "R studio with Latest R version ",
      },
      {
        name: "R v4",
        value: "4",
        description: "R studio with R version 4",
      },
      {
        name: "R v4.4",
        value: "4.4",
        description: "R studio with R version 4.4",
      },
      {
        name: "R v4.4.1",
        value: "4.4.1",
        description: "R studio with R version 4.4.1",
      },
      {
        name: "R v3.6.3",
        value: "3.6.3",
        description: "R studio with R version 3.6.3",
      },
      {
        name: "R v3.6.2",
        value: "3.6.2",
        description: "R studio with R version 3.6.2",
      },
      {
        name: "R v3.3.0",
        value: "3.3.0",
        description: "R studio with R version 3.3.0",
      },
    ],
  });
  return answer;
}

// ask for the password to set for the rstudio
async function getPassword() {
  const password = await input({
    message: "Enter a new password (min: 3 chars)",
    required: true,
    validate: (input_pass) => {
      if (input_pass.length > 3) {
        return true;
      } else return false;
    },
  });
  return password;
}

// show spinner - untill provisioned
const spinner = createSpinner("Provisioning a Rstudio").start();


const HOST = "115.246.211.178";
const PORT = 61002;
const USERNAME = "pradeept";
// const USERNAME = process.env.SSH_USERNAME;
const PASSWORD = "pass@#$";
// const PASSWORD = process.env.SSH_PASSWORD;
const DEPLOYMENT_PORT = Math.floor(Math.random() * (6000 - 5000) + 5000);

const conn = new Client();
conn
  .on("ready", () => {
    console.log(" Client :: ready" );

    // Docker run
    conn.exec(`docker run -p ${DEPLOYMENT_PORT}:8787 -d -e PASSWORD=${RPASSWORD} rocker/rstudio:${RVERSION}`, (err, stream) => {
      if (err) throw err;
      stream
        .on("close", (code, signal) => {
          console.log(`Stream :: close :: code: ${code}`);
          if (code == 0) {
            console.log(chalk.green("\nR studio has been provisioned successfully !"));
            console.log(
              chalk.bgWhite.blue(`http://${HOST}:${DEPLOYMENT_PORT}`)
            );
          }
          conn.end();
        })
        .on("data", (data) => {
          // Successful run output
          spinner.stop();
          spinner.success({ text: `STDOUT: ${data}` });
        })
        .stderr.on("data", (data) => {
          // On error
          console.log(" STDERR: " + data);
          spinner.warn({text: "Please re-run the script. If error persisits contact DevOps"})
        });
    });
  })
  .connect({
    host: HOST,
    port: PORT,
    username: USERNAME,
    password: PASSWORD,
  });


  // Enchancements:

  // - Add volume
  // - Add domain & SSL cert