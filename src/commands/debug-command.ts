import { Command } from "./@command-base";
import { Message } from "discord.js";
import bot, { BotManager } from "../bot";

export class DebugCommand extends Command {

    match(str: string): boolean {
        return str.indexOf('debug') > -1;
    }
    execute(msg: Message): void {
        msg.channel.send(BotManager.hasAccessRole(msg));
    }

}