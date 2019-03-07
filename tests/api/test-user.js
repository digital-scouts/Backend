const should = require('chai').should();

module.exports = function () {

    describe('Users', function () {
        describe('/POST user', () => {
            it('should post a new user with minimal correct data', (done) => {
                const x = 300;
                x.should.equal(401);
                done();
            });

            it('should post a new user with maximal correct data', (done) => {
                notRready.should(wrong);
                done();
            });

            it('should fail with wrong email', (done) => {
                notRready.should(wrong);
                done();
            });

            it('should fail without email', (done) => {
                notRready.should(wrong);
                done();
            });

            it('should fail with already existing email', (done) => {
                notRready.should(wrong);
                done();
            });

            it('should fail without name_first', (done) => {
                notRready.should(wrong);
                done();
            });

            it('should fail without name_last', (done) => {
                notRready.should(wrong);
                done();
            });

            it('should fail without role', (done) => {
                notRready.should(wrong);
                done();
            });

            it('should fail without password', (done) => {
                notRready.should(wrong);
                done();
            });
        });

        describe('/GET users', () => {
            it('should get all users in the same group', (done) => {
                notRready.should(wrong);
                done();
            });

            it('should fail with missing permission', (done) => {
                notRready.should(wrong);
                done();
            });

            it('should fail with wrong token', (done) => {
                notRready.should(wrong);
                done();
            });
        });

        describe('/PUT user', () => {
            it('should update a user', (done) => {
                notRready.should(wrong);
                done();
            });

            it('should fail with wrong id', (done) => {
                notRready.should(wrong);
                done();
            });

            it('should fail with missing permission', (done) => {
                notRready.should(wrong);
                done();
            });

            it('should fail with wrong token', (done) => {
                notRready.should(wrong);
                done();
            });
        });

        describe('/PUT user-image', () => {
            it('should update a user image', (done) => {
                notRready.should(wrong);
                done();
            });

            it('should fail with wrong id', (done) => {
                notRready.should(wrong);
                done();
            });

            it('should fail with missing permission', (done) => {
                notRready.should(wrong);
                done();
            });

            it('should fail with wrong token', (done) => {
                notRready.should(wrong);
                done();
            });
        });

        describe('/PUT user-password', () => {
            it('should update a user password', (done) => {
                notRready.should(wrong);
                done();
            });

            it('should fail with wrong id', (done) => {
                notRready.should(wrong);
                done();
            });

            it('should fail with missing permission', (done) => {
                notRready.should(wrong);
                done();
            });

            it('should fail with wrong token', (done) => {
                notRready.should(wrong);
                done();
            });
        });

        describe('/PUT user-email', () => {
            it('should update a user email', (done) => {
                notRready.should(wrong);
                done();
            });

            it('should fail with wrong id', (done) => {
                notRready.should(wrong);
                done();
            });

            it('should fail with missing permission', (done) => {
                notRready.should(wrong);
                done();
            });

            it('should fail with wrong token', (done) => {
                notRready.should(wrong);
                done();
            });
        });

    });

};