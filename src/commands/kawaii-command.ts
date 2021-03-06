import { Command } from "./@command-base";
import { Message } from "discord.js";
import { botManager } from "../bot";

export class KawaiiCommand extends Command {
    
    match(str: string): boolean {
        return str.indexOf('kawaii') > -1;
    }

    execute(msg: Message): void {
        msg.channel.send({files: ['./assets/voice/moemoekyun.mp3']});
        botManager.changeNicknameWithChance(msg);
    }

}