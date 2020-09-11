import { GuildCommand } from "./guilds-command";
import { ChannelCommand } from "./channel-command";
import { GrabCommand } from "./grab-command";
import { RoleCommand } from "./role-command";

export default [
    new GuildCommand(),
    new ChannelCommand(),
    new GrabCommand(),
    new RoleCommand()
]