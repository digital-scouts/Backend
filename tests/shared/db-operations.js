const should = require('chai').should();

let models = {
    users: require('../../models/userModel').User,
    message: require("../../models/messageModel").TextMessage,
    chat: require("../../models/chatModel").Chat
};

// There are cases where a hard reset of the database is needed - for example to resolve duplicate indexes
// (DO THIS ONLY IN DEV ENVIRONMENT - ALL DATA WILL BE LOST): in the mongo command line db.dropDatabase()
async function clearDatabase() {
    for (let modelKey in models) {
        await models[modelKey].deleteMany()
            .then((data) => console.log(data));
        console.log("Test DB - collection '" + modelKey + "' cleared.");
    }
}


module.exports = {
    clearDatabase: clearDatabase
};