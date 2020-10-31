import { GuildMember, Role } from "discord.js";
import { botStorage } from "./bot";
import config from "./config";
import { iMutedMember } from "./interfaces";

export class MutableMember {

    onTick: (mm: MutableMember) => void;
    
    roles: Role[];
    boosterRole: Role;

    timer: NodeJS.Timer = null;

    constructor(public member: GuildMember, public mutedRole: Role) {}

    async mute(mins: number) {
        if (this.timer) throw Error('User is already muted. Use unmute command first');

        this.roles = this.member.roles.cache.array();
        this.boosterRole = this.member.roles.cache.get(config.vbooster_role_id);

        await this.member.roles.set(this.boosterRole ? [this.boosterRole, this.mutedRole] : [this.mutedRole]);

        MutableMember.cache({member_id: this.member.id, removed_roles_ids: this.roles.map(r => r.id)});

        this.timer = setTimeout(() => {
            this.timer = null;
            if (this.onTick) this.onTick(this);
        }, mins * 60000);
    }

    async unmute() {
        if (this.timer) clearTimeout(this.timer);

        await this.member.roles.set(this.roles);
        
        this.timer = null;
        this.roles = null;
        this.boosterRole = null;

        MutableMember.uncache(this.member.id);
    }

    destroy() {
        if (this.timer) clearTimeout(this.timer);
        this.timer = null;
        this.roles = null;
        this.boosterRole = null;
        MutableMember.uncache(this.member.id);
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