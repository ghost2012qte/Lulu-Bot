import { Command } from "./@command-base";
import { Message } from "discord.js";

export class DebugCommand extends Command {

    match(str: string): boolean {
        return str.indexOf('debug') > -1;
    }

    async execute(msg: Message) {
        const members = await msg.guild.members.fetch();
        let reply = '';
        members.forEach(m => {
            reply += m.toString()
        })
        msg.channel.send(reply);
    }

}