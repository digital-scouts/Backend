const jwt = require('jsonwebtoken');

let models = {
    message: require('./../../models/messageModel').TextMessage,
    chat: require('./../../models/chatModel').Chat,
    user: require('./../../models/userModel').User
};

const chai = require('chai'),
    chaiHttp = require('chai-http');
chai.use(chaiHttp);

async function clearDatabase() {
    for (let modelKey in models) {
        await models[modelKey].deleteMany().exec();
    }
}

/**
 *
 * @param id
 * @param server
 * @return {Promise}
 */
function disableUser(id, server) {
    let done;
    models['user'].findByIdAndUpdate(id, {$set: {'accountStatus.disabled': true}}, {new: true}, (err, doc) => {
        done = true;
    });
    return new Promise(resolve => {
        function checkFlag() {
            if (done) {
                resolve();
            } else {
                setTimeout(checkFlag, 100);
            }
        }

        checkFlag();
    });
}

/**
 *
 * @param id
 * @param server
 * @return {Promise}
 */
function activateUser(id, server) {
    let done;
    models['user'].findByIdAndUpdate(id, {$set: {'accountStatus.activated': true}}, {new: true}, (err, doc) => {
        done = true;
    });

    return new Promise(resolve => {
        function checkFlag() {
            if (done) {
                resolve();
            } else {
                setTimeout(checkFlag, 100);
            }
        }

        checkFlag();
    });
}

/**
 *
 * @param id
 * @param server
 * @return {Promise}
 */
function deactivateUser(id, server) {
    let done;
    models['user'].findByIdAndUpdate(id, {$set: {'accountStatus.activated': false}}, {new: true}, (err, doc) => {
        done = true;
    });

    return new Promise(resolve => {
        function checkFlag() {
            if (done) {
                resolve();
            } else {
                setTimeout(checkFlag, 100);
            }
        }

        checkFlag();
    });
}

/**
 * create a user and activate it
 * @param user
 * @param server
 * @return {Promise} with 'token' and 'id'
 */
function prepareUser(user, server) {
    let id;
    let token;

    chai.request(server)
        .post('/api/users')
        .send(user)
        .end((err, res) => { // create a woe and save id
            id = res.body._id;
            chai.request(server)
                .post('/api/auth')
                .send({email: user.email, password: user.password})
                .end(async (err, res) => { //auth the woe and save token
                    await activateUser(id, server);
                    token = res.body.token;
                });
        });

    return new Promise(resolve => {
        function checkFlag() {
            if (token) {
                resolve({
                    id: id,
                    token: token
                });
            } else {
                setTimeout(checkFlag, 100);
            }
        }

        checkFlag();
    });
}


module.exports = {
    clearDatabase: clearDatabase,
    activateUser: activateUser,
    deactivateUser: deactivateUser,
    disableUser: disableUser,
    prepareUser: prepareUser
};
