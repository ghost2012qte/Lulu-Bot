import { Command } from "./@command-base";
import { SayCommand } from "./say-command";
import { ClearCommand } from "./clear-command";
import { DebugCommand } from "./debug-command";
import { KawaiiCommand } from "./kawaii-command";
import { VersionCommand } from "./version-command";
import { PromoteCommand } from "./promote-command";
import { HandCommand } from "./hand-command";
import { StealAvatarCommand } from "./steal-avatar-command";
import { ActivityCommand } from "./activity-command";
import { MuteCommand } from "./mute-command";
import { AutoroleCommand } from "./autorole-command";
import { ExecCommand } from "./exec-command";

export const role_commands: Command[] = [
    new SayCommand(),
    new KawaiiCommand(),
    new StealAvatarCommand()
]

export const moder_commands: Command[] = [
    new MuteCommand()
]

export const admin_commands: Command[] = [
    ...[
        new ClearCommand(),
        new VersionCommand(),
        new PromoteCommand(),
        new HandCommand(),
        new DebugCommand(),
        new ActivityCommand(),
        new AutoroleCommand(),
        new ExecCommand()
    ],
    ...role_commands,
    ...moder_commands
]