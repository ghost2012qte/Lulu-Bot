import { Command } from "./@command-base";
import { Message } from "discord.js";
//import { botManager } from "../bot";

export class SayCommand extends Command {
    
    match(str: string): boolean {
        return str.indexOf('say') > -1;
    }
    execute(msg: Message): void {
        const match = msg.content.match(/.*\s+say\s+(.+)/);
        if (match && match[1]) {
            msg.delete();
            msg.channel.send(match[1]);
        }
        //botManager.changeNicknameWithChance(msg);
    }
}