const dbOperations = require('../shared/db-operations');

const chai = require('chai'),
    chaiHttp = require('chai-http'),
    should = chai.should(),
    expect = chai.expect;

chai.use(chaiHttp);

module.exports = function (test_data, server) {


    describe('Calendar', function () {
        describe('create a event', function () {
            it('should create a new Event'/*, (done) => {
                chai.request(server)
                    .get('/api/calendar')
                    .send({token: 'token'})
                    .end((err, res) => {
                        expect(res).to.have.status(401);
                        done();
                    });
            }*/);
            describe('overlapping events', function () {
                it('should warn when overlapping event for a member/group will be created');
                it('should warn when overlapping event for a complement will be created');
            });

            describe('attachments', function () {
                it('XY');
            });

            it('should create a new event with correct start/end');
            it('should fail with incorrect start/end');
            it('should create a new event with existing competent');
            it('should fail with not existing competent');
            it('should create a new event with existing member');
            it('should fail with not existing member');
            it('should create a new event with valid address');
            it('should fail with invalid address');

        });

        describe('get events', function () {
            it('should get all events');
            it('should get all/only events filtered by timespan');
            it('should get all/only events filtered by group');
            it('should get all/only events filtered by competent');
            it('should get all/only events filtered by origin');
            it('should get all/only events filtered by eventType');
            it('should get all/only events filtered by visibility');

            it('should get all/only public events without token');
            it('should need a token for all non public events');
        });

        describe('update event', function () {
            it('XY');
        });

        describe('create groupLesson', function () {
            it('XY');
        });

        describe('get groupLesson', function () {
            it('XY');
        });

        describe('edit groupLesson', function () {
            it('XY');
        });


        describe('date finder', function () {
            it('should suggest all free timespan´s for a event');
            it('should give a hint, why timespan is not available');
            it('should notice holidays');
            it('should notice not available leaders');
        });
    });
};
