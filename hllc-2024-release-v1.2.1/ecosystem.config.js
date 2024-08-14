require("dotenv").config();

/**
 * Get environment instance variables
 * @param {string} key - key of environment variable
 * @param {string} project - project to get
 * @param {"string"|"number"} type - xtype of value to return
 * @returns environment instance variables
 */
const getEnv = (key, project, type, init) => {
  const env =
    process.env[`HLLC_${key.toUpperCase()}_${project.toUpperCase()}`] || init;
  if (type === "number") {
    return parseInt(env) || 1;
  }
  return env;
};

const getPort = (project, init) => {
  return getEnv("PORT", project, "number", init);
};
const getInstance = (project, init) => {
  return getEnv("INSTANCE", project, "number", init);
};

module.exports = {
  apps: [
    {
      name: "backend",
      script: "dist/main.js",
      cwd: "./backend",
      port: getPort("backend", 5000),
      instances: getInstance("backend", 1),
      exec_mode: "cluster_mode",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "student",
      script: ".output/server/index.mjs",
      cwd: "./frontend/student",
      port: getPort("student", 3000),
      instances: getInstance("student", 1),
      exec_mode: "cluster_mode",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "admin",
      script: ".output/server/index.mjs",
      cwd: "./frontend/admin",
      port: getPort("admin", 3001),
      instances: getInstance("admin", 1),
      exec_mode: "cluster_mode",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "staff",
      script: ".output/server/index.mjs",
      cwd: "./frontend/staff",
      port: getPort("staff", 3002),
      instances: getInstance("staff", 1),
      exec_mode: "cluster_mode",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "lecturer",
      script: ".output/server/index.mjs",
      cwd: "./frontend/lecturer",
      port: getPort("lecturer", 3003),
      instances: getInstance("lecturer", 1),
      exec_mode: "cluster_mode",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
