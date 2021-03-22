import { Command } from "./@command-base";
import { Message } from "discord.js";
import bot from "../bot";
import config from "../config";

export class DebugCommand extends Command {

    match(str: string): boolean {
        return str.indexOf('debug') > -1;
    }

    async execute(msg: Message) {
        try {
            const vbois = bot.guilds.cache.get(config.vbois.guild_id);
            if (vbois) {
                const members = (await msg.guild.members.fetch()).filter(m => m.presence.status !== 'offline' && !m.user.bot);
                let response = '';
                members.forEach(m => {
                    response += m.displayName + '\n';
                })
                msg.channel.send(response);
            }
        }
        catch (e) {
            msg.channel.send(e);
        }
    }

}