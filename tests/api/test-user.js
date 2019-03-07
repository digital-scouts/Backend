module.exports = function (dependencies) {
    let chai = dependencies.chai,
        expect = dependencies.expect;

    describe('Users', function () {
        describe('/POST user', () => {
            it('should post a new user with minimal correct data', (done)=>{
                const x = 300;
                x.should.equal(401);
            });

            it('should post a new user with maximal correct data', (done)=>{});

            it('should fail with wrong email', (done)=>{});

            it('should fail without email', (done)=>{});

            it('should fail with already existing email', (done)=>{});

            it('should fail without name_first', (done)=>{});

            it('should fail without name_last', (done)=>{});

            it('should fail without role', (done)=>{});

            it('should fail without password', (done)=>{});
        });

        describe('/GET users', () => {
            it('should get all users in the same group', (done)=>{});

            it('should fail with missing permission', (done)=>{});

            it('should fail with wrong token', (done)=>{});
        });

        describe('/PUT user', () => {
            it('should update a user', (done)=>{});

            it('should fail with wrong id', (done)=>{});

            it('should fail with missing permission', (done)=>{});

            it('should fail with wrong token', (done)=>{});
        });

        describe('/PUT user-image', () => {
            it('should update a user image', (done)=>{});

            it('should fail with wrong id', (done)=>{});

            it('should fail with missing permission', (done)=>{});

            it('should fail with wrong token', (done)=>{});
        });

        describe('/PUT user-password', () => {
            it('should update a user password', (done)=>{});

            it('should fail with wrong id', (done)=>{});

            it('should fail with missing permission', (done)=>{});

            it('should fail with wrong token', (done)=>{});
        });

        describe('/PUT user-email', () => {
            it('should update a user email', (done)=>{});

            it('should fail with wrong id', (done)=>{});

            it('should fail with missing permission', (done)=>{});

            it('should fail with wrong token', (done)=>{});
        });

    });

};