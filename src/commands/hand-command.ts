import { Message } from "discord.js";
import bot, { BotManager } from "../bot";
import config from "../config";
import { LuluGrab } from "../lulu-grab";
import { Command } from "./@command-base";

export class HandCommand extends Command {

    match(str: string): boolean {
        return str.indexOf('hand') > -1;
    }
    execute(msg: Message): void {
        if (msg.content.indexOf('throw-in') > -1) {
            this.throwHand(msg);
        }
        
    }

    private async throwHand(msg: Message) {
        const match = msg.content.match(/throw-in\s+(\d+)/);
        if (match) {
            const mSecs = parseInt(match[1]);
            const vbois = bot.guilds.cache.get(config.vbois_guild_id);
            const role = await vbois?.roles.fetch(config.vbois_role_id);

            if (mSecs && vbois && role) {
                const ch = BotManager.getAvailableChannels(vbois, role).random();
                setTimeout(() => {
                    const luluGrab = new LuluGrab();
                    luluGrab
                        .do(ch)
                        .then(LuluGrab.getDefaulGrabFn(vbois))
                        .finally(luluGrab.destroy);
                    
                }, mSecs);
                
                console.log(`Принудительный вброс руки в канал ${ch.name} через ${mSecs} милисекунд`);
            }
        }

    }
    
}