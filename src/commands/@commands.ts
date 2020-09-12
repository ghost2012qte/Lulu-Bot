import { GuildCommand } from "./guilds-command";
import { ChannelCommand } from "./channel-command";
import { GrabCommand } from "./grab-command";
import { InitCommand } from "./init-command";
import { Command } from "./@command-base";
import { SayCommand } from "./say-command";
import { ClearCommand } from "./clear-command";
import { DebugCommand } from "./debug-command";
import { KawaiiCommand } from "./kawaii-command";

export const role_commands: Command[] = [
    new SayCommand(),
    new KawaiiCommand(),

    new DebugCommand()
]

export const admin_commands: Command[] = [
    ...[
        new GuildCommand(),
        new ChannelCommand(),
        new GrabCommand(),
        new InitCommand(),
        new ClearCommand()
    ],
    ...role_commands
]