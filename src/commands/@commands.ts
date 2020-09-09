import { GuildCommand } from "./guilds-command";
import { ChannelCommand } from "./channel-command";
import { GrabCommand } from "./grab-command";

export default [
    new GuildCommand(),
    new ChannelCommand(),
    new GrabCommand()
]