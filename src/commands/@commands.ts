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
        new InitCommand(),
        new ClearCommand()
    ],
    ...role_commands
]