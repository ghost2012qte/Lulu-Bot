import Discord from 'discord.js';

export abstract class Command {
    abstract match(str: string): boolean;
    abstract execute (msg: Discord.Message): void;
}
