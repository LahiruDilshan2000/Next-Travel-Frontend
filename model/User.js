export class User {
    constructor(userId,
                userName,
                nic,
                address,
                email,
                password,
                role,
                userImage) {
        this.userId = userId;
        this.userName = userName;
        this.nic = nic;
        this.address = address;
        this.email = email;
        this.password = password;
        this.role = role;
        this.userImage = userImage;
    }
}