import fs from "fs";
import path from "path";
import { CliProps } from "../cli";

export interface Command {
  run(cli: CliProps): void | any;
  help(): string;
}

export interface CommandList {
  [commandName: string]: Command;
}

export const getCommands = (): any => {
  const nonCommands = ["index", "Command"];
  const files = fs.readdirSync(path.resolve(__dirname), "utf8");
  const commands: any = {};
  for (let file of files) {
    const filenameWithoutExt = file.split(".")[0];
    const commandName = filenameWithoutExt.toLocaleLowerCase();
    if (!nonCommands.includes(filenameWithoutExt)) {
      const commandPath: string = path.resolve(__dirname, file);
      const CommandClass = require(commandPath).default;
      commands[commandName] = new CommandClass();
    }
  }
  return commands;
};

export const getCommandsList = (): string => {
  const commands = getCommands();
  return Object.keys(commands)
    .sort()
    .map(commandName => {
      return `$ ${commandName}`;
    })
    .join("\n  ");
};
