import { Message } from 'discord.js';
import { Command } from "./@command-base";
import { BotManager } from "../bot";

export class InitCommand extends Command {

    

    match(str: string) {
        return str.indexOf('init') > -1;
    }

    execute(msg: Message) {
        if (msg.content.indexOf('roles') > -1) {
            BotManager.initRoles(msg.guild, text => {msg.reply(text)});
        }
        else if (msg.content.indexOf('activity') > -1) {
            BotManager.initActivity(msg.guild, text => {msg.reply(text)});
        }
        else if (msg.content.indexOf('hand')  > -1) {
            const role = msg.mentions.roles.first();
            if (role) {
                BotManager.initHand(msg.guild, role, text => {msg.channel.send(text)});
            }
            else {
                msg.reply('Роль с таким именем не найдена.');
            }
        }
    }

}