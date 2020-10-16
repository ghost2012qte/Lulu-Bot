import { Message } from "discord.js";
import { botStorage, roleManager } from "../bot";
import config from "../config";
import { iMutedMember, RoleType } from "../interfaces";
import { Command } from "./@command-base"

export class MuteCommand extends Command {

    storageKey = 'mutedMembers';

    match(str: string): boolean {
        return str.indexOf('mute') > -1;
    }

    async execute(msg: Message) {
        const match = msg.content.match(/mute.+\s(\d+)/);
        if (match && msg.mentions.members.size) {
            try {
                const mentionedMember = msg.mentions.members.first();
                const memberRoles = mentionedMember.roles.cache.array();
                const boosterRole = mentionedMember.roles.cache.get(config.vbooster_role_id);
                const mins = parseInt(match[1]);
                // const expiredDate = new Date();
                // expiredDate.setMinutes(expiredDate.getMinutes() + mins);

                // this.save({
                //     id: mentionedMember.id,
                //     removedRolesIds: mentionedMember.roles.cache.map(r => r.id),
                //     expiredTimeMs: expiredDate.getTime()
                // })

                const mutedRole = await msg.guild.roles.fetch(roleManager.getCreatedRoleId(msg.guild, RoleType.MuteRole));
                await mentionedMember.roles.set(boosterRole ? [boosterRole, mutedRole] : [mutedRole]);

                setTimeout(async () => {
                    mentionedMember.roles.set(memberRoles);
                    //this.delete(mentionedMember.id);
                }, mins * 60000)

                msg.channel.send(`${mentionedMember} has been muted for ${mins} min`);
            }
            catch (e) {
                console.log(e);
            }
        }
    }
    
    save(v: iMutedMember) {
        const jsoned = botStorage.getItem(this.storageKey);
        const mutedMembers: iMutedMember[] = jsoned ? JSON.parse(jsoned) : [];
        mutedMembers.push(v);
        botStorage.setItem(this.storageKey, JSON.stringify(mutedMembers));
    }

    delete(id: string) {
        const jsoned = botStorage.getItem(this.storageKey);
        let mutedMembers: iMutedMember[] = jsoned ? JSON.parse(jsoned) : [];
        mutedMembers = mutedMembers.filter(mm => mm.id != id);
        botStorage.setItem(this.storageKey, JSON.stringify(mutedMembers));
    }
    // private mute(msg: Message) { }
    // private unmute(msg: Message) { }

}