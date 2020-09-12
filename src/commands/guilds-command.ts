import { Command } from "./@command-base";
import { Message } from 'discord.js';
import bot from "../bot";

export class GuildCommand extends Command {

    match(str: string) {
        return str.indexOf('guild') > -1
    }

    execute(msg: Message) {
        let answer = '\n';
        for (let guild of bot.guilds.cache) {
            answer += `${guild[1].id} ${guild[1].name}\n`;
        }
        msg.reply(answer);
    }
}