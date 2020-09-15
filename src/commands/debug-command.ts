import { Command } from "./@command-base";
import { Message, TextChannel } from "discord.js";
import { LuluGrab } from "../lulu-grab";
import { LuluEmoji } from "../emojis";
import { BotManager } from "../bot";
import { RoleType } from "../interfaces";

export class DebugCommand extends Command {

    match(str: string): boolean {
        return str.indexOf('debug') > -1;
    }

    execute(msg: Message): void {
        const luluGrab = new LuluGrab(3500);
        luluGrab
                .do(msg.channel as TextChannel)
                .then(e => {
                    if (e.captured.length == 1) {
                        e.channel.send('Попа~лся');
                    }
                    else if (e.captured.length > 1) {
                        e.channel.send('Попа~лись');
                    }
                    else {
                        const lulu1 = msg.guild.emojis.cache.get(LuluEmoji.mikuded);
                        if (lulu1) {
                            e.channel.send(`${lulu1}${lulu1}`);
                        }
                    }
                    
                    const role = BotManager.roleManager.getCreatedRoleId(msg.guild, RoleType.GivenOnceCapturedRole);
                    if (role) {
                        e.captured.forEach(msg => {
                            msg.member.roles.add(role);
                        })
                    }
                })
                .finally(luluGrab.destroy);
    }

}