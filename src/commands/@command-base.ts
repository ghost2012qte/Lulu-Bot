import Discord from 'discord.js';

export abstract class Command {
    abstract match(str: string): boolean;
    abstract execute (msg: Discord.Message, bot: Discord.Client): void;
}
