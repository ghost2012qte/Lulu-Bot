import config from "./config";
import { GuildMember, Role, TextChannel } from "discord.js";
import { botStorage } from "./bot";
import { iMutedMember } from "./interfaces";

export class MuteBox {

    static onDestroy: (box: MuteBox) => void;

    roles: Role[];

    timer: NodeJS.Timer;

    constructor(public member: GuildMember, public muteRole: Role, public time: number) {
        this.roles = this.member.roles.cache.filter(r => r.id !== config.vbooster_role_id).array();
    }

    async activate() {
        await this.setMutedState();
        MuteBox.cache({member_id: this.member.id, removed_roles_ids: this.roles.map(r => r.id)});

        this.timer = setTimeout(() => {
            const moderCh = this.member.guild.channels.cache.get(config.vbois_moderator_channel_id) as TextChannel;
            if (moderCh) {
                moderCh.send(`${this.member} was unmuted by time expiration.`);
            }
            this.timer = null;
            this.destroy();
        },
        this.time);
    }

    async setMutedState() {
        const boosterRole = this.member.roles.cache.get(config.vbooster_role_id);
        await this.member.roles.set(boosterRole ? [boosterRole, this.muteRole] : [this.muteRole]);
    }

    async destroy() {
        try {
            if (this.timer) clearTimeout(this.timer);
            const boosterRole = this.member.roles.cache.get(config.vbooster_role_id);
            await this.member.roles.set(boosterRole ? [...this.roles, boosterRole] : this.roles);
        }
        catch (e) {
            console.log(e);
        }
        finally {
            MuteBox.uncache(this.member.id);
            MuteBox.onDestroy(this);
        }
    }

    static get storageList(): iMutedMember[] {
        const json = botStorage.getItem('muted_list');
        return json ? JSON.parse(json) : [];
    }

    static set storageList(list: iMutedMember[]) {
        botStorage.setItem('muted_list', JSON.stringify(list));
    }

    static cache(mm: iMutedMember) {
        const list = this.storageList;
        list.push(mm);
        this.storageList = list;
    }

    static uncache(memberId: string) {
        const list = this.storageList;
        this.storageList = list.filter(mm => mm.member_id != memberId);
    }
}