import { ImageSize, Message } from "discord.js";
import { Command } from "./@command-base";

export class StealAvatarCommand extends Command {
    
    match(str: string): boolean {
        return str.indexOf('stealavatar') > -1;
    }

    execute(msg: Message): void {
        const metioned = msg.mentions.users.first();
        if (metioned) {
            msg.channel.send(metioned.avatarURL({
                format: 'png',
                dynamic: true,
                size: this.parseSize(msg.content)
            }))
        }
    }

    private parseSize(m: string): ImageSize {
        const match = m.match(/--size=(16|32|64|128|256|512|1024|2048|4096)/);
        return match ? <ImageSize>parseInt(match[1]) : 512;
    }
}