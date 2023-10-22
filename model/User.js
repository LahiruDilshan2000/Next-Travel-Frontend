export class User {
    constructor(userId,
                username,
                nic,
                address,
                email,
                password,
                role,
                userImage) {
        this.userId = userId;
        this.username = username;
        this.nic = nic;
        this.address = address;
        this.email = email;
        this.password = password;
        this.role = role;
        this.userImage = userImage;
    }
}