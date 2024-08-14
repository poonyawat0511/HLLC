import projects from "../config/projects.mjs";
import prompts from "prompts";

const entries = Object.values(projects);

/**
 * Select a project from cmd
 * @param {"nuxt"|"nest"} engine
 * @returns
 */
export const selectProject = async (engine) => {
  const { project } = await prompts({
    type: "select",
    name: "project",
    message: `Select project to run command`,
    choices: entries
      .filter((item) => !engine || engine === item.engine)
      .map((project) => ({
        title: project.name,
        value: project,
      })),
    initial: 0,
  });
  return project;
};
