const { DBCollectionCreation } = require('../config/mongo');
class User {
    colleciton = "users";
    constructor(id, username, token, origin) {
        this.id = id;
        this.username = username;
        this.token = token;
        this.oauth = origin;
    }

    async saveToken() {
        const doc = { id: this.id, username: this.username, token: this.token, oauth: this.oauth };

        try {
            const coll = await DBCollectionCreation(this.colleciton);
            const userExists = await coll.findOne({ id: doc.id }); // Await the findOne operation

            if (!userExists) {
                // create a new user
                await coll.insertOne(doc);
                console.log("User created successfully");
            } else {
                // replace token of the registered user
                await coll.updateOne({ id: this.id }, {
                    $set: {
                        token: doc.token
                    }
                });
                console.log("Token updated successfully");
            }
            return 1;
        } catch (error) {
            console.error("Error saving token:", error);
            return 0; // or throw error, depending on your error handling strategy
        }
    }

    async findUserByUsername(username) {
        try {
            const coll = await DBCollectionCreation(this.colleciton);
            const options = {
                projection: { _id: 0, id: 1, username: 1 },
            };

            const user = await coll.findOne({ username: { $regex: new RegExp(username, 'i') } }, options);


            if (user == null) {
                throw new Error("User not found");
            }

            return user;
        } catch (error) {
            throw error; // Throw the error for the calling code to handle
        }
    }

}

class Friend {
    colleciton = "friends"
    constructor(user_id, friend_id, relatioship = this.colleciton) {
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
            const userColl = await DBCollectionCreation("users");  // call scheme 
            const friendColl = await DBCollectionCreation(this.colleciton); // call scheme
            const userExists = await userColl.findOne({ id: doc.user })
            const friendExists = await userColl.findOne({ id: doc.friend })
            console.log(userExists, friendExists);
            if (userExists && friendExists && doc.user != doc.friend) {
                await friendColl.insertOne(doc);
                return 1;
            }
            else {
                return 0;
            }

        } catch (error) {
            console.log(error);
            1
        }
    }
}

module.exports = {
    User,
    Friend
}