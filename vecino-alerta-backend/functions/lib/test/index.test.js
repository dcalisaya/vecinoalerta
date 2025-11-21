"use strict";
const admin = require('firebase-admin');
const fft = require('firebase-functions-test');
const { expect } = require('chai');
require('mocha');
// Initialize test environment
const testEnv = fft({
    projectId: 'vecinoalerta-test',
});
// Import functions
const myFunctions = require('../src/index');
describe('Cloud Functions', () => {
    before(() => {
        if (admin.apps.length === 0) {
            admin.initializeApp();
        }
    });
    after(() => {
        testEnv.cleanup();
    });
    describe('triggerEmergency', () => {
        it('should be a function', async () => {
            expect(myFunctions.triggerEmergency).to.be.a('function');
        });
    });
    describe('createSilentReport', () => {
        it('should be a function', () => {
            expect(myFunctions.createSilentReport).to.be.a('function');
        });
    });
});
//# sourceMappingURL=index.test.js.map