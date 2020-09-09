import Discord from 'discord.js';

export interface iLuluGrabEvent {
    captured: Discord.Message[]
    channel: Discord.TextChannel
}