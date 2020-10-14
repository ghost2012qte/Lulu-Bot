import { Message, TextChannel } from 'discord.js';

export interface iLuluGrabEvent {
    captured: Message[]
    channel: TextChannel
}

export enum RoleType {
    CommandAccessRole,
    GivenOnceCapturedRole,
    MuteRole
}

export type activityType = "PLAYING"|"LISTENING"|"WATCHING";

export interface iMutedMember {
    id: string
    expiredTimeMs: number
    removedRolesIds: string[]
}