const { DBCollectionCreation } = require('../config/mongo');
class User {
    constructor(id, username, token, origin) {
        this.id = id;
        this.username = username;
        this.token = token;
        this.oauth = origin;
    }

    async saveToken() {
        const doc = { id: this.id, username: this.username, token: this.token, oauth: this.oauth }
        try {
            const coll = await DBCollectionCreation("user");
            const userExists = coll.findOne({ id: doc.id })
            if (userExists == null) {
                // create a new user
                await coll.insertOne(doc);
            }
            else {
                // replace token of the registred user
                await coll.updateOne({ id: this.id }, {
                    $set: {
                        token: doc.token
                    }
                })
            }
            return 1;

        } catch (error) {
            console.log(error);
        }
    }
    async findUserByUsername(username) {
        try {
            const coll = await DBCollectionCreation("user");
            const options = {
                // Sort matched documents in descending order by rating
                sort: { "username": -1 },
                // Include only the `title` and `imdb` fields in the returned document
                projection: { id:1 ,username:1},
            }
            const user = await coll.findOne({ username: username }, options);
            return user;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

}

class Friend {
    constructor(user_id, friend_id, relatioship = "friends") {
        this.user = user_id
        this.friend = friend_id
        this.relation = relatioship
    }

    async save() {
        const doc = {
            user: this.user,
            friend: this.friend,
            relation: this.relation
        }
        try {
            const userColl = await DBCollectionCreation("user");  // call scheme 
            const friendColl = await DBCollectionCreation("friends"); // call scheme
            const userExists = await userColl.findOne({ id: doc.user})
            const friendExists = await userColl.findOne({ id: doc.friend })
            console.log(userExists, friendExists);
            if (userExists && friendExists) {
                await friendColl.insertOne(doc);
                return 1;
            }
            else {
                return 0;
            }

        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = {
    User,
    Friend
}