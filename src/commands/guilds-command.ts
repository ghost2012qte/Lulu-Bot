import { Command } from "./@command-base";
import Discord from 'discord.js';

export class GuildCommand extends Command {

    match(str: string) {
        return str.indexOf('guild') > -1
    }

    execute(msg: Discord.Message, bot: Discord.Client) {
        let answer = '\n';
        for (let guild of bot.guilds.cache) {
            answer += `${guild[1].id} ${guild[1].name}\n`;
        }
        msg.reply(answer);
    }
}