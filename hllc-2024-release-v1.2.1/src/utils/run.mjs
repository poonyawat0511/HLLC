import { spawn } from "child_process";

export default (command, cwd) => {
  return new Promise((resolve, reject) => {
    // Spawn the process
    const commandProcess = spawn(command, {
      shell: true,
      stdio: "inherit",
      cwd: cwd,
    });

    // Log any errors that occur during the process
    commandProcess.on("error", (error) => {
      reject(error);
    });

    // Log when the process exits
    commandProcess.on("close", (code) => {
      resolve(code);
    });
  });
};
