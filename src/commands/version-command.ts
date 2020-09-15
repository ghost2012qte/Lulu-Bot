import { Command } from "./@command-base";
import { Message } from "discord.js";
import config from "../config";

export class SayCommand extends Command {
    match(str: string): boolean {
        return str.indexOf('version') > -1 || str.indexOf('-v') > -1;
    }
    execute(msg: Message): void {
        msg.reply(`LULU BOT ${config.version}`);
    }
}