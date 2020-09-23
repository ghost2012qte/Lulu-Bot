import Discord, { Guild } from 'discord.js';
import bot, { roleManager } from './bot';
import { LuluEmoji } from './emojis';
import { iLuluGrabEvent, RoleType } from './interfaces';

export class LuluGrab {

    private channel: Discord.TextChannel;
    private captured: Discord.Message[];
    private isGrabbing = false;

    constructor (private grabbingDuration = 7000) {
        console.log('Lulu Grab Created');
        bot.on('message', this.onMessage);
    }

    do(channel: Discord.TextChannel) {
        this.channel = channel;

        const p = new Promise<iLuluGrabEvent>(resolve => {
            this.captured = [];
            this.channel.send({files: ['./assets/lulu_grab1.png']}).then(() => {
                this.isGrabbing = true;
                setTimeout(() => {
                    this.channel.send({files: ['./assets/lulu_grab2.png']}).then(() => {
                        this.isGrabbing = false;
                        resolve({
                            captured: this.captured,
                            channel: this.channel
                        })
                    })
                }, this.grabbingDuration);
            })
        })

        p.then(c => {
            this.captured = null;
            this.channel = null;
            return c;
        })

        return p;
    }

    destroy = () => {
        bot.off('message', this.onMessage);
        this.isGrabbing = false;
        this.captured = null;
        this.channel = null;
        console.log('Lulu Grab Destroyed');
    }

    private onMessage = (msg: Discord.Message) => {
        console.log('message while lulu grab class exists');
        if (this.isGrabbing && msg.channel.id == this.channel.id && msg.author.id != bot.user.id && !this.captured.find(m => m.author.id == msg.author.id)) {
            this.captured.push(msg);
        }
    }

    static getDefaulGrabFn(guild: Guild) {
        return async (e: iLuluGrabEvent) => {
            if (e.captured.length == 1) {
                e.channel.send('Попа~лся');
            }
            else if (e.captured.length > 1) {
                e.channel.send('Попа~лись');
            }
            else {
                const lulu1 = guild.emojis.cache.get(LuluEmoji.lulu_big1);
                const lulu2 = guild.emojis.cache.get(LuluEmoji.lulu_big2);
                if (lulu1 && lulu2) {
                    e.channel.send(`${lulu1}${lulu2}`);
                }
            }

            if (e.captured.length) {
                const role = await guild.roles.fetch(roleManager.getCreatedRoleId(guild, RoleType.GivenOnceCapturedRole), false);
                if (role) {
                    e.captured.forEach(msg => {
                        msg.member.roles.add(role);
                    })
                }
            }
        }
    }
}