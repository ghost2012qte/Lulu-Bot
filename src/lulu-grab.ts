import Discord from 'discord.js';
import bot from './bot';
import { iLuluGrabEvent } from './interfaces';

export class LuluGrab {

    private channel: Discord.TextChannel;
    private captured: Discord.Message[];
    private isGrabbing = false;

    constructor (private grabbingDuration = 3000) {
        console.log('Lulu Grab Created');
        bot.on('message', this.onMessage);
    }

    do(channel: Discord.TextChannel) {
        this.channel = channel;

        return new Promise<iLuluGrabEvent>((resolve, reject) => {
            if (this.channel) {
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
            }
            else reject("Available channel wasn't found");
        })
        .then(c => {
            this.captured = null;
            this.channel = null;
            return c;
        })
    }

    destroy() {
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
}