let chai = require('chai'),
    chaiHttp = require('chai-http'),
    expect = require('chai').expect;

chai.use(chaiHttp);

module.exports = {
    chai: chai,
    expect: expect,
};