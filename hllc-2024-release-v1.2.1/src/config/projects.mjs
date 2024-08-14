import * as path from "path";
import * as fs from "fs";
import chalk from "chalk";
import prompts from "prompts";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const location = path.join(__dirname, "../..");

/**
 *
 * @param {import('prompts').PromptObject} questions
 * @returns
 */
function setup(questions) {
  return async function () {
    const configFile = path.join(this.cwd, ".env");
    const envStr = chalk.yellow(".env");
    const name = chalk.yellow(this.name);
    if (fs.existsSync(configFile)) {
      const result = await prompts({
        name: "recreate",
        type: "confirm",
        message: `${envStr} file in ${name} is already exists do you want to recreate it`,
      });
      // User exit prompt
      if (result.recreate === undefined) {
        process.exit(1);
      }
      // User select no to recreate
      if (result.recreate === false) return;
    }

    console.log("Configuration for project", name);
    const config = await prompts(questions);

    console.log("Writing", envStr, "for", name, "...");
    const envContent = Object.entries(config)
      .map(([key, value]) => `${key}=${value}`)
      .join("\n");
    fs.writeFileSync(configFile, envContent, "utf-8");
    console.log(chalk.green("Success"));
  };
}

export const projects = {
  backend: {
    name: "backend",
    engine: "nest",
    command: {
      dev: "yarn start:dev",
      install: "yarn install",
      build: "yarn build",
      start: "yarn start:prod",
      preview: "yarn start",
    },
    cwd: path.join(location, "backend"),
    setup: setup([
      {
        name: "MONGO_URI",
        type: "text",
        initial: "mongodb://127.0.0.1:27017",
        message: "MongoDB connection uri",
      },
      {
        name: "DATABASE_NAME",
        type: "text",
        initial: "hllc-dev",
        message: "MongoDB database name",
      },
      {
        name: "PORT",
        type: "number",
        initial: 8080,
        message: "Port for application running",
      },
    ]),
  },
  shared: {
    name: "shared",
    engine: "nuxt",
    command: {
      dev: "yarn dev",
      install: "yarn install && yarn dev:prepare",
      build: "yarn dev:build",
      lint: "yarn lint",
    },
    cwd: path.join(location, "frontend", "shared"),
    setup() {},
  },
  student: {
    name: "student",
    engine: "nuxt",
    command: {
      dev: "yarn dev",
      install: "yarn install",
      build: "yarn build",
      start: "yarn start",
      lint: "yarn lint",
      lintfix: "yarn lint:fix",
      preview: "yarn preview",
    },
    cwd: path.join(location, "frontend", "student"),
    setup: setup([
      {
        name: "NITRO_PORT",
        type: "number",
        initial: 3000,
        message: "Port for application running",
      },
      {
        name: "BASE_URL",
        type: "text",
        initial: "http://localhost:8080/api",
        message: "API base URL",
      },
    ]),
  },
  admin: {
    name: "admin",
    engine: "nuxt",
    command: {
      dev: "yarn dev",
      install: "yarn install",
      build: "yarn build",
      start: "yarn start",
      lint: "yarn lint",
      lintfix: "yarn lint:fix",
      preview: "yarn preview",
    },
    cwd: path.join(location, "frontend", "admin"),
    setup: setup([
      {
        name: "NITRO_PORT",
        type: "number",
        initial: 3001,
        message: "Port for application running",
      },
      {
        name: "BASE_URL",
        type: "text",
        initial: "http://localhost:8080/api",
        message: "API base URL",
      },
    ]),
  },
  staff: {
    name: "staff",
    engine: "nuxt",
    command: {
      dev: "yarn dev",
      install: "yarn install",
      build: "yarn build",
      start: "yarn start",
      lint: "yarn lint",
      lintfix: "yarn lint:fix",
      preview: "yarn preview",
    },
    cwd: path.join(location, "frontend", "staff"),
    setup: setup([
      {
        name: "NITRO_PORT",
        type: "number",
        initial: 3002,
        message: "Port for application running",
      },
      {
        name: "BASE_URL",
        type: "text",
        initial: "http://localhost:8080/api",
        message: "API base URL",
      },
    ]),
  },
  lecturer: {
    name: "lecturer",
    engine: "nuxt",
    command: {
      dev: "yarn dev",
      install: "yarn install",
      build: "yarn build",
      start: "yarn start",
      lint: "yarn lint",
      lintfix: "yarn lint:fix",
      preview: "yarn preview",
    },
    cwd: path.join(location, "frontend", "lecturer"),
    setup: setup([
      {
        name: "NITRO_PORT",
        type: "number",
        initial: 3003,
        message: "Port for application running",
      },
      {
        name: "BASE_URL",
        type: "text",
        initial: "http://localhost:8080/api",
        message: "API base URL",
      },
    ]),
  },
  sponsor: {
    name: "sponsor",
    engine: "nuxt",
    command: {
      dev: "yarn dev",
      install: "yarn install",
      build: "yarn build",
      start: "yarn start",
      lint: "yarn lint",
      lintfix: "yarn lint:fix",
      preview: "yarn preview",
    },
    cwd: path.join(location, "frontend", "sponsor"),
    setup: setup([
      {
        name: "NITRO_PORT",
        type: "number",
        initial: 3004,
        message: "Port for application running",
      },
      {
        name: "BASE_URL",
        type: "text",
        initial: "http://localhost:8080/api",
        message: "API base URL",
      },
    ]),
  },
};

export default projects;
