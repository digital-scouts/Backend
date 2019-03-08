let models = {
    message: require("./../../models/messageModel").TextMessage,
    chat: require("./../../models/chatModel").Chat,
    user: require("./../../models/userModel").User
};

async function clearDatabase() {
    for (let modelKey in models) {
        await models[modelKey].deleteMany().exec();
    }
}


module.exports = {
    clearDatabase: clearDatabase
};
