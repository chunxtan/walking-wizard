import { action, makeObservable, observable } from "mobx";
import { getToken } from "../../../util/security"

type UserPayload = {
    firstName: string,
    lastName: string,
    userId: string,
    email: string,
    is_admin: string
}

export interface UserStore {
    user: UserPayload | null,
    login: boolean
}

export class LoginUserStore implements UserStore {
    user: UserPayload | null;
    login: boolean;

    constructor() {
        this.user = null,
        this.login = false

        makeObservable(this, {
            user: observable,
            login: observable,
            setUser: action,
            setLogin: action
        })
    }

    setUser(user: UserPayload): void {
        this.user = user;
    }

    setLogin(val: boolean): void {
        this.login = val;

        if (val === true) {
            this.getUserPayload()
        }
    }

    getUserPayload(): void {
        const token = getToken();
        const payload = token ? JSON.parse(atob(token.split(".")[1])).payload : null;
        console.log("payload", payload);
        if (payload && payload.email) {
            console.log("payload set");
            this.setUser(payload);
        }
    }
}