const assert = require('assert');
const app = require('../../src/app');

describe('\'pelulus\' service', () => {
  it('registered the service', () => {
    const service = app.service('pelulus');

    assert.ok(service, 'Registered the service (pelulus)');
  });
});
