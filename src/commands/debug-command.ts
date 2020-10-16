import { Command } from "./@command-base";
import { Message } from "discord.js";

export class DebugCommand extends Command {

    match(str: string): boolean {
        return str.indexOf('debug') > -1;
    }

    async execute(msg: Message) {
        const member = msg.mentions.members?.first();
        if (member) {
            let message = `${member.displayName} has following roles:\n`;
            member.roles.cache.forEach(r => {
                message += `${r.name} - ${r.id}\n`;
            })
            msg.channel.send(message.replace('@', ''));            
        }
    }

}