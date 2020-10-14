import { Message } from "discord.js";
import { botStorage, roleManager } from "../bot";
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
                const mins = parseInt(match[1]);
                const expiredDate = new Date();
                expiredDate.setMinutes(expiredDate.getMinutes() + mins);

                this.save({
                    id: mentionedMember.id,
                    removedRolesIds: mentionedMember.roles.cache.map(r => r.id),
                    expiredTimeMs: expiredDate.getTime()
                })

                mentionedMember.roles.remove(mentionedMember.roles.cache);
                mentionedMember.roles.add(await msg.guild.roles.fetch(roleManager.getCreatedRoleId(msg.guild, RoleType.MuteRole)));

                setTimeout(async () => {
                    mentionedMember.roles.add(memberRoles);
                    mentionedMember.roles.remove(await msg.guild.roles.fetch(roleManager.getCreatedRoleId(msg.guild, RoleType.MuteRole)));
                    this.delete(mentionedMember.id);
                }, mins * 60000)

                msg.channel.send(`${mentionedMember} has been muted for ${mins} min`);
            }
            catch (e) {
                msg.channel.send(e);
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