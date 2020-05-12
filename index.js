const Koa = require('koa');
const koaLogger = require('koa-logger');
const logger = require('logger');
const cors = require('@koa/cors');
const body = require('koa-body');
const mount = require('koa-mount');
const validate = require('koa-validate');
const passport = require('koa-passport');
const jwt = require('koa-jwt');
const mongoose = require('mongoose');

const authRouter = require('routes/auth.router');

const mongoUri = 'mongodb://localhost:27017/jwt-db';

const OnDBReady = (err) => {
    if (err) {
        logger.error('Error connecting', err);
        throw new Error('Error connecting', err);
    }

    const app = new Koa();

    if (process.env.NODE_ENV === 'dev') {
        app.use(cors());
        app.use(koaLogger());
    }

    // TODO revisar para que era
    // app.keys = ['claveSuperSecreta'];

    // incluir body para parsear el payload de la request en forma de json
    // TODO revisar si es mejor usar koa-bodyparser
    app.use(body());

    // Tiempo de respuesta
    app.use(async (ctx, next) => {
        const start = Date.now();
        await next();
        const time = Date.now() - start;
        ctx.set('X-Response-Time', `${time} ms`);
    });

    // Decorar la aplicacion con metodos para validar
    validate(app);

    app.use(authRouter.routes());

    app.listen(3000, function (err) {
        if (err) {
            console.error('Error listening in port 3000', err);
            process.exit(1);
        }
        console.log('Koa server listening in port 3000');
    });
}

mongoose.connect(
    mongoUri,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    OnDBReady
);