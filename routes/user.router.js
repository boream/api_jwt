const Router = require('@koa/router');
const UserModel = require('models/user.model');

class UserRouter {
    static async getProfile(ctx) {
        // ctx.state.user tiene la info codificada en el token
        const email = ctx.state.user.email;
        const user = await UserModel.findOne({ email });
        ctx.body = user;
    }
}

const router = new Router({ prefix: '/user' });
router.get('/profile', UserRouter.getProfile);
module.exports = router;