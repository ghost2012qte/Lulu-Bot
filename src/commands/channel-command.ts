import { Command } from "./@command-base";

import Discord from 'discord.js';

export class ChannelCommand extends Command {

    match(str: string) {
        return str.indexOf('channel') > -1;
    }

    execute(msg: Discord.Message, bot: Discord.Client) {
        let answer = '\n';
        for (let ch of msg.guild?.channels.cache || []) {
            answer += `${ch[1].id} ${ch[1].name} ${ch[1].type}\n`;
        }
        msg.reply(answer);
    }
}