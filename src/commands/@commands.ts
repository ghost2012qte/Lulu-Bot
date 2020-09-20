import { InitCommand } from "./init-command";
import { Command } from "./@command-base";
import { SayCommand } from "./say-command";
import { ClearCommand } from "./clear-command";
import { DebugCommand } from "./debug-command";
import { KawaiiCommand } from "./kawaii-command";
import { VersionCommand } from "./version-command";
import { PromoteCommand } from "./promote-command";
import { HandCommand } from "./hand-command";
import { StealAvatarCommand } from "./steal-avatar-command";

export const role_commands: Command[] = [
    new SayCommand(),
    new KawaiiCommand(),
    new StealAvatarCommand()
]

export const admin_commands: Command[] = [
    ...[
        new InitCommand(),
        new ClearCommand(),
        new VersionCommand(),
        new PromoteCommand(),
        new HandCommand(),
        new DebugCommand()
    ],
    ...role_commands
]