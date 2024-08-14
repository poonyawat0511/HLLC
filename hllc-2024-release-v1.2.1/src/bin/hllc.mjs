#!/usr/bin/env node
import { Command } from "commander";
import { selectProject } from "../utils/project.mjs";
import run from "../utils/run.mjs";
import projects from "../config/projects.mjs";
import chalk from "chalk";
import { fileURLToPath } from "url";
import * as fs from "fs";
import * as path from "path";
import prompts from "prompts";

const program = new Command();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const location = path.join(__dirname, "../..");

const checkLocation = () => {
  if (!process.cwd().includes(location)) {
    console.log(
      "You are not in root directory",
      chalk.yellow("hllc"),
      "project"
    );
    console.log(
      "Run",
      chalk.yellow("`hllc open`"),
      "to open vs code in hllc location"
    );
    console.log("Or run", chalk.yellow(`cd ${location}`));
    process.exit(1);
  }
};

if (process.argv.length === 2) checkLocation();

program
  .name("HLLC 2024")
  .description("HLLC CLI tool for project management")
  .version("1.0.0");

/**
 * Get project from cli
 * @param {*} project
 * @param {"nuxt"|"nest"} engine
 * @returns
 */
async function getProject(project, engine) {
  let target = project;
  if (!target) {
    target = await selectProject(engine);
    if (!target) process.exit(1);
  } else {
    target = projects[project];
    if (!target) {
      const keys = Object.keys(projects)
        .filter((item) => !engine || engine === item.engine)
        .map((v) => chalk.yellow(v))
        .join(", ");
      console.error("Project", chalk.yellow(project), "Not exist!");
      console.log("Try:", keys);
      process.exit(1);
    }
  }
  return target;
}

program
  .command("open")
  .description("Open a project with vscode")
  .action(async () => {
    if (process.cwd() === location) {
      console.log("You are now in", chalk.yellow("hllc"), "working directory");
      process.exit(0);
    }
    await run(`code ${location}`);
  });

program
  .command("setup")
  .description("setup hllc project")
  .action(async () => {
    checkLocation();
    for (const project of Object.values(projects)) {
      console.log("running", chalk.yellow(project.name));
      await run(project.command.install, project.cwd);
      await project.setup();
    }

    process.exit(0);
  });

program
  .command("install")
  .argument("[project]", "project to run")
  .allowUnknownOption(true)
  .description("install project packages")
  .action(async (project, options) => {
    checkLocation();
    if (!project) {
      for (const project of Object.values(projects)) {
        console.log("running", chalk.yellow(project.name));
        await run(project.command.install, project.cwd);
      }
      process.exit(0);
    }
    const target = await getProject(project);
    const flags = process.argv.slice(4);
    await run([target.command.install, ...flags].join(" "), target.cwd);
  });

program
  .command("dev")
  .argument("[project]", "project to run")
  .description("run project in development mode")
  .action(async (project) => {
    checkLocation();
    const target = await getProject(project);
    await run(target.command.dev, target.cwd);
  });

program
  .command("add")
  .argument("[project]", "project to run")
  .description("add package to project")
  .allowUnknownOption(true)
  .action(async (project) => {
    checkLocation();
    const target = await getProject(project);
    const flags = process.argv.slice(4);
    await run(["yarn", "add", ...flags].join(" "), target.cwd);
  });

program
  .command("build")
  .argument("[project]", "project to run")
  .description("build project for production")
  .allowUnknownOption(true)
  .action(async (project) => {
    checkLocation();
    if (!project) {
      for (const project of Object.values(projects)) {
        console.log("running", chalk.yellow(project.name));
        await run(project.command.build, project.cwd);
      }
      process.exit(0);
    }
    const target = await getProject(project);
    await run(target.command.build, target.cwd);
  });

program
  .command("config")
  .argument("[project]", "project to run")
  .description("build project for production")
  .allowUnknownOption(true)
  .action(async (project) => {
    checkLocation();
    if (!project) {
      for (const project of Object.values(projects)) {
        await project.setup();
      }
      process.exit(0);
    }
    const target = await getProject(project);
    await target.setup();
  });

program
  .command("start")
  .argument("[project]", "project to run")
  .description("start built project in production")
  .allowUnknownOption(true)
  .action(async (project) => {
    checkLocation();
    const target = await getProject(project);
    await run(target.command.start, target.cwd);
  });

program
  .command("preview")
  .argument("[project]", "project to run")
  .description("start built project in preview mode")
  .allowUnknownOption(true)
  .action(async (project) => {
    checkLocation();
    const target = await getProject(project);
    await run(target.command.preview, target.cwd);
  });

program
  .command("deploy")
  .description("start project deployment")
  .allowUnknownOption(true)
  .action(async () => {
    checkLocation();
    await run("pm2 start");
  });

program
  .command("lint")
  .argument("[project]", "project to run")
  .option("--fix", "run lint fix")
  .description("use linter tool for project")
  .allowUnknownOption(true)
  .action(async (project, options) => {
    checkLocation();
    const target = await getProject(project, "nuxt");
    if (options.fix) {
      if (!target.command.lintfix) {
        const name = chalk.yellow(target.name);
        console.error("Project", name, "has no command lintfix");
        process.exit(1);
      }
      await run(target.command.lintfix, target.cwd);
    } else {
      if (!target.command.lint) {
        const name = chalk.yellow(target.name);
        console.error("Project", name, "has no command lint");
        process.exit(1);
      }
      await run(target.command.lint, target.cwd);
    }
  });

async function rewritePrompt(location) {
  const { confirm } = await prompts([
    {
      name: "confirm",
      type: "confirm",
      message: `This command will rewrite ${chalk.yellow(location)}`,
    },
  ]);
  return confirm;
}

const TEMPLATE_DIR = path.join(location, "src/template");
async function writeFile({ project, location, template, deep }) {
  // Get project location to write file
  const app = path.join(project.cwd, location);
  if (fs.existsSync(app) && !deep) {
    // Make sure to rewrite
    const data = await rewritePrompt(location);
    if (data === null) process.exit(1);
    if (!data) return;
  }

  console.log("Writing file...");
  // Template to write in project path
  const contentPath = path.join(TEMPLATE_DIR, template);
  const content = fs.readFileSync(contentPath);
  const writeDir = path.dirname(contentPath);
  // Make sure write dir exists
  !fs.existsSync(writeDir) && fs.mkdirSync(writeDir, { recursive: true });

  // Write template into pjoject
  fs.writeFileSync(app, content, { encoding: "utf-8" });

  // Show location
  const created = path.relative(process.cwd(), app);
  console.log("Success created file", chalk.yellow(created));
}

program
  .command("nuxt init")
  .argument("<target>", "target to init")
  .argument("[project]", "Project to init")
  .option("-y", "Deep rewrite")
  .description("Genereate layout view for blank project")
  .action(async (_, action, project, options) => {
    if (action === "layout") {
      const target = await getProject(project, "nuxt");
      await writeFile({
        project: target,
        location: "app.vue",
        template: "App.vue",
        deep: options.y,
      });
      await writeFile({
        project: target,
        location: "layouts/default.vue",
        template: "Layout.vue",
        deep: options.y,
      });
      await writeFile({
        project: target,
        location: "pages/index.vue",
        template: "Page.vue",
        deep: options.y,
      });
    }
  });

program.parse(process.argv);
