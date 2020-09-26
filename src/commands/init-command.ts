import { Message } from 'discord.js';
import { Command } from "./@command-base";
import { botManager } from "../bot";

export class InitCommand extends Command {

    

    match(str: string) {
        return str.indexOf('init') > -1;
    }

    execute(msg: Message) {
        if (msg.content.indexOf('roles') > -1) {
            botManager.initRoles(msg.guild, text => {msg.reply(text)});
        }
        else if (msg.content.indexOf('activity') > -1) {
            botManager.initActivity(msg.guild, text => {msg.reply(text)});
        }
    }

}