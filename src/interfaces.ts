import { Message, TextChannel } from 'discord.js';

export interface iLuluGrabEvent {
    captured: Message[]
    channel: TextChannel
}

export enum RoleType {
    CommandAccessRole,
    GivenOnceCapturedRole
}

export type activityType = "PLAYING"|"LISTENING"|"WATCHING";