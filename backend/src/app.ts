import { join } from 'node:path'
import AutoLoad, { AutoloadPluginOptions } from '@fastify/autoload'
import { FastifyPluginAsync, FastifyServerOptions } from 'fastify'
import fastifyCors from '@fastify/cors'
import { createDbConnection } from './utils/mysql'
import { Migrator, FileMigrationProvider } from 'kysely'
import { promises as fs } from 'fs';
import * as path from 'path';
import multipart from '@fastify/multipart'
import { ensureUploadDir } from './utils/fs'
import EleringService from './services/elering'
export interface AppOptions extends FastifyServerOptions, Partial<AutoloadPluginOptions> {

}
// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {
}

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts
): Promise<void> => {
  fastify.register(fastifyCors);

  const db = createDbConnection();
  fastify.decorate('db', db);
  fastify.decorateRequest('db', { getter() { return fastify.db }})

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname, '/migrations/'),
    }),
  })
  
  const migrations = async () => {
    const { error } = await migrator.migrateToLatest();
    
    if (error) {
      console.error('error', error)
      return;
    }
  }

  migrations();

  fastify.register(multipart);
  ensureUploadDir();

  fastify.addHook('onClose', async (instance) => {
    await migrator.migrateDown();
  });

  const eleringService = new EleringService();
  fastify.decorate('eleringService', eleringService);
  fastify.decorateRequest('eleringService', { getter() { return eleringService }});
  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  // eslint-disable-next-line no-void
  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'plugins'),
    options: opts
  })

  // This loads all plugins defined in routes
  // define your routes in one of these
  // eslint-disable-next-line no-void
  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'routes'),
    options: opts
  })
}

export default app
export { app, options }
