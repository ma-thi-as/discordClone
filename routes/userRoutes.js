const express = require("express");

const { DBCollectionCreation, connectToAtlas } = require("../config/mongo");
const { Friend, User } = require("../Models/User");
const router = express.Router()

router.use(express.json())


router.get('/searchUser', async (req, res) => {
    try {
        const user = new User();
        const username = req.query.username; // Supongo que el parámetro se llama "username"
        const userExists = await user.findUserByUsername(username);

        if (userExists == null) {
            res.status(400).json({ error: "User not found" })
        }
        res.status(200).json({ friend: userExists });

    } catch (error) {
        console.error("Error al buscar usuario:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});



router.post('/new-friend', async (req, res) => {
    const current_user = req.session.user
    const friendId = req.body.friend
    const friend = new Friend(current_user.id, friendId)
    await friend.save()
})


router.get('/my-friends', async (req, res) => {
    try {
        
        const friends_collection = await DBCollectionCreation("friends");
        const users_collection = await DBCollectionCreation("users");
        let friend_list = [];
    
        const friends_query = await friends_collection.find({ user: req.session.user.id }, {
            projection: { _id: 0, friend: 1 }
        }).toArray()
    
        for (let index = 0; index < friends_query.length; index++) {
            const element = friends_query[index];
            const friend_match = await users_collection.findOne({ id: element.friend }, { projection: { username: 1 } });
            friend_list.push(friend_match.username)   
        }
        res.status(200).send({friends: friend_list})
        
    } catch (error) {
        console.log(error);    
    }
})
module.exports = router