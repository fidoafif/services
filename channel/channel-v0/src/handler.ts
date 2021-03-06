import { ErrorFilter } from '@magishift/util/dist';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { Context, Handler } from 'aws-lambda';
import { createServer, proxy } from 'aws-serverless-express';
import express = require('express');
import { Server } from 'http';
import { moduleFactory } from './app.module';
import { HttpExceptionFilter } from './http-exceptions.filter';
import { getSecretValue } from './services/ssm/secretManager.service';
import { SwaggerBuilder } from './swagger.options';

// NOTE: If you get ERR_CONTENT_DECODING_FAILED in your browser, this is likely
// due to a compressed response (e.g. gzip) which has not been handled correctly
// by aws-serverless-express and/or API Gateway. Add the necessary MIME types to
// binaryMimeTypes below
const binaryMimeTypes: string[] = [];

const cachedServers: Server[] = [];

process.on('unhandledRejection', reason => {
  console.error(reason);
});

process.on('uncaughtException', reason => {
  console.error(reason);
});

function bootstrapServer(
  currentStage: string,
  host: string,
  password: string,
  username: string,
  port: number
): Promise<Server> {
  try {
    const expressApp = express();

    const adapter = new ExpressAdapter(expressApp);

    return NestFactory.create(
      moduleFactory(host, password, username, port),
      adapter
    )
      .then(app => {
        const document = SwaggerBuilder(app, currentStage);

        expressApp.use((_, res, next) => {
          res.header('Access-Control-Allow-Origin', '*');
          res.header(
            'Access-Control-Allow-Methods',
            'GET,PUT,PATCH,POST,DELETE'
          );
          res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
          next();
        });

        expressApp.get('/swagger', (_req, res) => {
          res.send(JSON.stringify(document));
        });

        app.enableCors();
        app.useGlobalFilters(new ErrorFilter(Logger));
        app.useGlobalFilters(new HttpExceptionFilter());

        return app.init();
      })
      .then(() => createServer(expressApp, undefined, binaryMimeTypes));
  } catch (error) {
    return Promise.reject(error);
  }
}

export const handler: Handler = (event: any, context: Context): any => {
  const currentStage: string = (process.env.STAGE || 'LOCAL').toUpperCase();

  const realm = (
    event.headers.Realm ||
    event.headers.realm ||
    'agora'
  ).toLowerCase();

  if (!cachedServers[realm]) {
    let host: string;
    let password: string;
    let username: string;
    let port: number;

    if (currentStage !== 'LOCAL') {
      const asmDBConf = `${
        process.env.DB_CONF_PREFIX
      }/${realm.toLowerCase()}/${currentStage.toLowerCase()}`;

      getSecretValue(asmDBConf, (_err, data) => {
        host = data.host;
        password = data.password;
        username = data.username;
        port = Number(data.port);

        bootstrapServer(currentStage, host, password, username, port).then(
          (server: Server) => {
            cachedServers[realm] = server;
            return proxy(server, event, context);
          }
        );
      });
    } else {
      host = process.env.TYPEORM_HOST;
      password = process.env.TYPEORM_PASSWORD;
      username = process.env.TYPEORM_USERNAME;
      port = Number(process.env.TYPEORM_PORT);

      bootstrapServer(currentStage, host, password, username, port).then(
        (server: Server) => {
          cachedServers[realm] = server;
          return proxy(server, event, context);
        }
      );
    }
  } else {
    return proxy(cachedServers[realm], event, context);
  }
};
