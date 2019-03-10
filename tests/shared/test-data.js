module.exports = {
    users: [{//test user with minimal data
        name_first: 'Test User',
        name_last: 'Minimal Data',
        email: 'woe1@mail.de',
        password: '1234sad??dd.S',
        role: 'woe'
    }, {//test user with maximal data
        name_first: 'Test User2',
        name_last: 'Maximal Data',
        email: 'jufi1@mail.de',
        password: '1234sad??dd.S',
        role: 'jufi',
        address: {
            plz: '25436',
            city: 'Heidgraben',
            street: 'Eichenweg',
            nr: '41'
        }
    }, {
        name_first: 'Test User',
        name_last: 'Admin',
        email: 'admin@mail.de',
        password: '1234sad??dd.S',
        role: 'admin',
    }, {
        name_first: 'Test User',
        name_last: 'Second Woe',
        email: 'woe2@mail.de',
        password: '1234sad??dd.S',
        role: 'woe'
    }, {
        name_first: 'Test User',
        name_last: 'Third Woe',
        email: 'woe3@mail.de',
        password: '1234sad??dd.S',
        role: 'woe'
    }, {
        name_first: 'Test User',
        name_last: 'Second Jufi',
        email: 'jufi2@mail.de',
        password: '1234sad??dd.S',
        role: 'jufi'
    }],
    wrong_data: {
        email: ['hastPeter', 'hast@Peter', 'hastPeter.de'],
        password: ['1234', 'test', 'unsafe!', '1234567890', 'LongUnsafePassword!']
    }
};
