import { ImageSize, Message } from "discord.js";
import bot, { botManager } from "../bot";
import { LuluEmoji } from "../emojis";
import { Command } from "./@command-base";

export class StealAvatarCommand extends Command {
    
    match(str: string): boolean {
        return str.indexOf('stealavatar') > -1;
    }

    execute(msg: Message): void {
        const metioned = msg.mentions.users.first();
        if (metioned) {
            if (metioned.id == bot.user.id) {
                const awakenEmoji = msg.guild.emojis.cache.get(LuluEmoji.lulu_awaken);
                if (awakenEmoji) msg.react(awakenEmoji);
                msg.channel.send('https://youtu.be/iWreXUtD5_U');
                return;
            }

            msg.channel.send(metioned.avatarURL({
                format: 'png',
                dynamic: true,
                size: this.parseSize(msg.content)
            }))
            botManager.changeNicknameWithChance(msg);
        }
    }

    private parseSize(m: string): ImageSize {
        const match = m.match(/--size=(16|32|64|128|256|512|1024|2048|4096)/);
        return match ? <ImageSize>parseInt(match[1]) : 1024;
    }
}