let models = {
    message: require("./../../models/messageModel").TextMessage,
    chat: require("./../../models/chatModel").Chat,
    user: require("./../../models/userModel").User
};

async function clearDatabase() {
    for (let modelKey in models) {
        models[modelKey].deleteMany().then((data)=>{
            data.ok.should.equal(1);
        });
    }
}


module.exports = {
    clearDatabase: clearDatabase
};
