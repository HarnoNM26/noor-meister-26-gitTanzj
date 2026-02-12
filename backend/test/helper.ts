import Fastify, { LightMyRequestResponse } from 'fastify'
import fp from 'fastify-plugin'
import assert from 'node:assert'

export function expectValidationError (res: LightMyRequestResponse, expectedMessage: string) {
  assert.strictEqual(res.statusCode, 400)
  const { message } = JSON.parse(res.payload)
  assert.strictEqual(message, expectedMessage)
}

import App from "../src/app";

export function build() {
  const app = Fastify();

  beforeAll(async () => {
    void app.register(fp(App));
    await app.ready();
  });

  afterAll(() => app.close());

  return app;
}
