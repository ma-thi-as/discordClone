const { DBCollectionCreation } = require('../config/mongo');
class User {
    constructor(id, username, access, origin) {
        this.id = id;
        this.username = username;
        this.token = access;
        this.oauth = origin;
    }

    async saveToken() {
        const data = { id: this.id, username: this.username, token: this.token, oauth: this.oauth }
        try {
            const coll = await DBCollectionCreation("user");
            const userExists = await coll.findOne({ id: data.id })
            if (userExists == null) {
                // create a new user
                await coll.insertOne(data);
            }
            else {
                // replace token of the loged user
                await coll.updateOne({ id: this.id }, {
                    $set: {
                        access: data.token
                    }
                })
            }
            return 1;

        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = {
    User
}