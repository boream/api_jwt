const Router = require('@koa/router');
const logger = require('logger');
const bcrypt = require('bcrypt');
const passport = require('koa-passport');
const UserModel = require('models/user.model');
const jsonwebtoken = require('jsonwebtoken');

class AuthRouter {
    static async createUser(ctx) {
        const salt = await bcrypt.genSalt();
        const password = await bcrypt.hash(
            ctx.request.body.password,
            salt
        );
        let user = null;
        try {
            user = await new UserModel({
                email: ctx.request.body.email,
                provider: 'local',
                salt,
                password
            }).save();
        } catch (error) {
            if (error.code === 11000) { // el usuario existe
                const err = `Duplicate user error: ${ctx.request.body.email}`;
                logger.error(err)
                ctx.body = {
                    msg: err
                }
                ctx.status = 409;
            } else {
                logger.error(error.errmsg);
                ctx.body = {
                    msg: error.errmsg
                }
                ctx.status = 500;
            }
            return;
        }

        ctx.body = user; // devolvemos usuario creado
        ctx.status = 201; // devolvemos status de creado
    }

    static async generateToken(ctx) {
        const user = ctx.state.user;
        const token = jsonwebtoken.sign({
            email: user.email,
            _id: user._id
        }, '1234');
        ctx.body = token;
    }
}

const router = new Router({ prefix: '/auth' });
router.post('/sign-up', AuthRouter.createUser);
router.post(
    '/login', 
    passport.authenticate('local', { session: false }),
    AuthRouter.generateToken
)
module.exports = router;