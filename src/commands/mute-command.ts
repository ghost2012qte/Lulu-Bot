import config from "../config";
import { Message, TextChannel } from "discord.js";
import bot, { botManager } from "../bot";
import { MuteBox } from "../MuteBox";
import { Command } from "./@command-base"

export class MuteCommand extends Command {

    prisoners = new Array<MuteBox>();

    constructor() {
        super();
        
        MuteBox.onDestroy = prisoner => {
            this.prisoners = this.prisoners.filter(p => p !== prisoner);
        }

        bot.on('guildMemberAdd', member => {
            const prisoner = this.prisoners.find(p => p.member.id === member.id);
            if (prisoner) {
                prisoner.setMutedState();
            }
        })
    }

    match(str: string): boolean {
        return str.indexOf('mute') > -1;
    }

    execute(msg: Message) {
        if (msg.mentions?.members?.size) {
            if (msg.content.indexOf('unmute') > -1) {
                this.unmute(msg);
            }
            else {
                const match = msg.content.match(/mute.+\s(\d+)\s*([a-zа-яё0-9_\s]*)/i);
                if (match) this.mute(msg, parseInt(match[1]), match[2]);
                else msg.channel.send('No time was provided.');
            }
        }
        else msg.channel.send('No user was provided.');
    }

    async mute(msg: Message, mins: number, reason: string) {
        const mentioned = msg.mentions.members.first();
        if (botManager.isModerOrParticipant(mentioned)) {
            msg.channel.send("You can't mute this user...");
            return;
        }
        if (this.isMuted(mentioned.id)) {
            msg.channel.send(`${mentioned} is already muted. Use unmute command first.`);
        }
        else {
            const muteRole = await msg.guild.roles.fetch(config.vbois.mute_role_id);
            try {
                const mutebox = new MuteBox(mentioned, muteRole, mins * 60000);
                await mutebox.activate();
                this.prisoners.push(mutebox);
                msg.channel.send(`${mentioned} was muted for ${mins} min.`);
                this.tryLog(msg, `${mentioned} was muted by ${msg.member} for ${mins} mins [${reason || 'No reason given'}]`);
            }
            catch (e) {
                msg.channel.send(e);
            }
        }
    }

    async unmute(msg: Message) {
        const mentioned = msg.mentions.members.first();
        const muted = this.prisoners.find(m => m.member.id == mentioned.id);
        if (muted) {
            await muted.destroy();
            msg.channel.send(`${mentioned} was unmuted.`);
            this.tryLog(msg, `${mentioned} was unmuted by ${msg.member}`);
        }
        else msg.channel.send(`${mentioned} is not muted`);
    }

    tryLog(msg: Message, text: string) {
        const moderCh = msg.guild.channels.cache.get(config.vbois.moderator_channel_id) as TextChannel;
        if (moderCh) {
            moderCh.send(text);
        }
    }

    isMuted(id: string) {
        return this.prisoners.some(p => p.member.id === id);
    }
}