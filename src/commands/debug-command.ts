import { Command } from "./@command-base";
import { Message } from "discord.js";

export class DebugCommand extends Command {

    match(str: string): boolean {
        return str.indexOf('debug') > -1;
    }

    execute(msg: Message): void {

    }

}