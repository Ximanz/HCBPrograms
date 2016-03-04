var expect = require("chai").expect;
var config = require("../config.js");

describe("Config", function() {
    describe("Initialise Config Variables", function() {
        it("returns the necessary constants", function() {
            var configVars = config.init();

            expect(configVars).to.include.keys('MONGOLAB_URI');
            expect(configVars.MONGOLAB_URI).to.not.be.empty;
            expect(configVars.MONGOLAB_URI).to.be.ok;

            expect(configVars).to.include.keys('API_SECRET');
            expect(configVars.API_SECRET).to.not.be.empty;
            expect(configVars.API_SECRET).to.be.ok;

            expect(configVars).to.include.keys('PASSWORD');
            expect(configVars.PASSWORD).to.not.be.empty;
            expect(configVars.PASSWORD).to.be.ok;
        });
    });
});