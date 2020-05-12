const koaPassport = require("koa-passport");
const LocalStrategy = require('passport-local').Strategy;
const UserModel = require('models/user.model');
const bcrypt = require('bcrypt');

async function registerLocal(email, password, done) {
    const user = await UserModel.findOne({ email, provider: 'local' });

    if (!user) {
        done(null, false);
        return;
    }

    const hashPassword = await bcrypt.hash(password, user.salt);

    if (hashPassword !== user.password) {
        done(null, false);
        return;
    }

    done(null, user);
}

koaPassport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, registerLocal));