import { Message } from "discord.js";
import bot, { botManager } from "../bot";
import config from "../config";
import { LuluGrab } from "../lulu-grab";
import { Command } from "./@command-base";

export class HandCommand extends Command {

    handTimerId: NodeJS.Timeout = null;

    match(str: string): boolean {
        return str.indexOf('hand') > -1;
    }

    execute(msg: Message): void {
        if (msg.content.indexOf('init') > -1) {
            this.initHand(msg);
        }
        else if (msg.content.indexOf('throw-in') > -1) {
            this.throwHand(msg);
        }
        else if (msg.content.indexOf('abort') > -1) {
            this.abortHand();
        }
    }

    private initHand(msg: Message) {
        const role = msg.mentions.roles.first();
        if (role) {
            botManager.initHand(msg.guild, role, text => {
                msg.channel.send(text);
                console.log(text);
            })
        }
        else {
            msg.channel.send('Роль с таким именем не найдена.');
        }
    } 

    private async throwHand(msg: Message) {
        const match = msg.content.match(/throw-in\s+(\d+)/);
        if (match) {
            const mSecs = parseInt(match[1]);
            const vbois = bot.guilds.cache.get(config.vbois_guild_id);
            const role = await vbois?.roles.fetch(config.vbois_role_id);

            if (mSecs && vbois && role) {
                const ch = botManager.getAvailableChannels(vbois, role).random();

                this.abortHand();

                this.handTimerId = setTimeout(() => {
                    const luluGrab = new LuluGrab();
                    luluGrab
                        .do(ch)
                        .then(LuluGrab.getDefaulGrabFn(vbois))
                        .finally(luluGrab.destroy);
                        this.handTimerId = null;
                }, mSecs);
                
                console.log(`Принудительный вброс руки в канал ${ch.name} через ${mSecs} милисекунд`);
            }
        }

    }

    private abortHand() {
        if (this.handTimerId) {
            clearTimeout(this.handTimerId);
            console.log('Hand has been aborted');
        }
    }
    
}