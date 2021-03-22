import { Message } from "discord.js";
import { Command } from "./@command-base";

export class ExecCommand extends Command {

    match(str: string): boolean {
        return str.indexOf('exec') > -1;
    }

    execute(msg: Message) {
        
    }
    
}