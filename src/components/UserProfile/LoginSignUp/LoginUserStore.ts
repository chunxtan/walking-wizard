import { action, makeObservable, observable } from "mobx";

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
    }
}