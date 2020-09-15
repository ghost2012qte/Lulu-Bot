import { Command } from "./@command-base";
import { Message } from "discord.js";

export class GiftCommand extends Command {

    match(str: string): boolean {
        return str.indexOf('gift') > -1;
    }
    execute(msg: Message): void {
        const upper = msg.content.toUpperCase();
        if (upper.indexOf('SPIDER') > -1) {

        }
        else if (upper.indexOf('SOUL') >1) {

        }
        else {

        }
    }

}