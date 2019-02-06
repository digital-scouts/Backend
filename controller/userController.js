const modelUser = require('../models/userModel').user,
    wrapWithRejectionHandler = require('./util').wrapWithRejectionHandler;


function getAll(request, response, next) {

}

async function addUser(request, result, next) {

}

function deleteAll(request, response, next) {

}

function getMe(request, response, next) {

}

async function setProfilePicture(request, response, next) {

}

function deleteMe(request, result, next) {

}

module.exports = {
    getAll: getAll,
    addOne: wrapWithRejectionHandler(addUser),
    deleteOne: deleteMe,
    getOne: getMe,
    deleteAll: deleteAll,
    setProfilePicture: setProfilePicture,
};