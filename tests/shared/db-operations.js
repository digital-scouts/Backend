const userModel = require('../../models/userModel');
const jwt = require('jsonwebtoken');

let models = {
    message: require('./../../models/messageModel').TextMessage,
    chat: require('./../../models/chatModel').Chat,
    user: require('./../../models/userModel').User
};

async function clearDatabase() {
    for (let modelKey in models) {
        await models[modelKey].deleteMany().exec();
    }
}

async function createUser(user) {
    let data = {
        id: null,
        token: null
    };
    let newUser = new userModel(user);
    await newUser.save().then(user => {
        const payload = {
            email: user.email,
            role: user.role,
            userID: user._id,
            userNameFirst: user.name_first,
            userNameLast: user.name_last
        };
        data.token = jwt.sign(payload, config.Config.salt, {expiresIn: 604800});
        data.id = user._id;
    });
    return data;
}


module.exports = {
    clearDatabase: clearDatabase,
    createUser: createUser
};
