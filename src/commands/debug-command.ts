import { Command } from "./@command-base";
import { Message } from "discord.js";
import bot from "../bot";
import config from "../config";

export class DebugCommand extends Command {

    match(str: string): boolean {
        return str.indexOf('debug') > -1;
    }

    async execute(msg: Message) {
        const vbois = bot.guilds.cache.get(config.vbois_guild_id);
        if (vbois) {
            const member = (await msg.guild.members.fetch()).filter(m => m.presence.status !== 'offline' && !m.user.bot).random();
            msg.channel.send(member.displayName);
        }
    }

}