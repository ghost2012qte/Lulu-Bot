import { Command } from "./@command-base";
import { Message, Permissions } from "discord.js";

export class DebugCommand extends Command {

    match(str: string): boolean {
        return str.indexOf('debug') > -1;
    }
    execute(msg: Message): void {
        const role = msg.mentions?.roles.first();
        msg.guild.channels.cache
            .filter(ch => ch.type == 'text' && (role ? ch.permissionsFor(role).has(Permissions.FLAGS.SEND_MESSAGES) : true))
            .forEach(ch => {
                msg.channel.send(`${ch}`);
            })
    }

}