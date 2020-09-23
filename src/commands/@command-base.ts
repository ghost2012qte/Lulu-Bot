import { Message } from 'discord.js';

export abstract class Command {

    abstract match(str: string): boolean;
    abstract execute (msg: Message): void;
}
