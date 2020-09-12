import { Command } from "./@command-base";
import { Message } from "discord.js";
import { botStorage } from "../bot";

export class ClearCommand extends Command {

    match(str: string): boolean {
        return str.indexOf('clear') > -1;
    }

    execute(msg: Message): void {
        if (msg.content.indexOf('storage') > -1) {
            botStorage.clear();
            return;
        }
    }

}