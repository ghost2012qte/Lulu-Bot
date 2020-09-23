import { Message } from "discord.js";
import { roleManager } from "../bot";
import { LuluEmoji } from "../emojis";
import { RoleType } from "../interfaces";
import { Command } from "./@command-base";

export class PromoteCommand extends Command {

    match(str: string): boolean {
        return str.indexOf('promote') > -1;
    }

    async execute(msg: Message): Promise<void> {
        const member = msg.mentions.members.first();
        const role = await msg.guild.roles.fetch(roleManager.getCreatedRoleId(msg.guild, RoleType.CommandAccessRole), false);
        
        if (member && role) {
            try {
                member.roles.add(role);
                const emoji = msg.guild.emojis.cache.get(LuluEmoji.konlulu_happy);
                if (emoji) msg.react(emoji);
                msg.channel.send({files: ['./assets/voice/KONLULU.mp3']});
            }
            catch(e) {}
        }
    }

}