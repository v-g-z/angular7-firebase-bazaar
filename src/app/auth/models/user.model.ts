export interface IUser {
    uid: string;
    displayName: string;
    emailVerified: boolean;
    photoUrl: string;
}

export class User implements IUser {
    constructor(
        public uid: string,
        public displayName: string,
        public emailVerified: boolean,
        public photoUrl: string
    ) { }
}
