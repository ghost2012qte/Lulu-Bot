import { Message } from 'discord.js';
import { LuluEmoji } from '../emojis';

export abstract class Command {

    abstract match(str: string): boolean;
    abstract execute (msg: Message): void;
}
