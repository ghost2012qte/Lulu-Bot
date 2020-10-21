import { GuildMember, Message } from "discord.js";
import { botManager, roleManager } from "../bot";
import { RoleType } from "../interfaces";
import { MutableMember } from "../Mutable-member";
import { Command } from "./@command-base"

export class MuteCommand extends Command {

    listOfMuted: MutableMember[] = [];

    match(str: string): boolean {
        return str.indexOf('mute') > -1;
    }

    execute(msg: Message) {
        if (msg.mentions?.members?.size) {
            if (msg.content.indexOf('unmute') > -1) {
                this.unmute(msg);
            }
            else {
                const match = msg.content.match(/mute.+\s(\d+)/);
                if (match) this.mute(msg, parseInt(match[1]));
                else msg.channel.send('No time was provided.');
            }
        }
        else msg.channel.send('No user was provided.');
    }

    async mute(msg: Message, mins: number) {
        const mentioned = msg.mentions.members.first();
        if (botManager.isModerOrParticipant(mentioned)) {
            msg.channel.send('You can not mute members with equal or higher role.');
            return;
        }
        const alreadyMuted = Boolean(this.listOfMuted.find(muted => muted.member.id == mentioned.id));
        if (alreadyMuted) msg.channel.send(`${mentioned} is already muted. Use unmute command first.`);
        else {
            const muteRole = await msg.guild.roles.fetch(roleManager.getCreatedRoleId(msg.guild, RoleType.MuteRole));
            try {
                const mutable = new MutableMember(mentioned, muteRole);
                mutable.onTick = this.onTick;
                await mutable.mute(mins);
                this.listOfMuted.push(mutable);
                msg.channel.send(`${mentioned} was muted for ${mins} min.`);
            }
            catch (e) {
                msg.channel.send(e);
            }
        }
    }

    async unmute(msg: Message) {
        const mentioned = msg.mentions.members.first();
        const muted = this.listOfMuted.find(m => m.member.id == mentioned.id);

        if (muted) {
            await muted.unmute();
            this.listOfMuted = this.listOfMuted.filter(m => m.member.id != muted.member.id);
            msg.channel.send(`${mentioned} was unmuted.`)
        }
        else msg.channel.send(`${mentioned} is not muted`);
    }

    onTick = (member: MutableMember) => {
        member.unmute();
        this.listOfMuted = this.listOfMuted.filter(m => m != member);
    }
}