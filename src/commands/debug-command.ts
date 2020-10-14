import { Command } from "./@command-base";
import { Message } from "discord.js";
import { roleManager } from "../bot";
import { RoleType } from "../interfaces";

export class DebugCommand extends Command {

    match(str: string): boolean {
        return str.indexOf('debug') > -1;
    }

    async execute(msg: Message) {
        const muteRole = await msg.guild.roles.fetch(roleManager.getCreatedRoleId(msg.guild, RoleType.MuteRole));
        msg.member.roles.set([muteRole]);
    }

}