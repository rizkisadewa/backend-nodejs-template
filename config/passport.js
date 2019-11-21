import {
    Strategy as LocalStrategy
} from 'passport-local';
import {
    Strategy as JwtStrategy,
    ExtractJwt
} from 'passport-jwt';
import {
    jwtSecretKey
} from '../config/jwt';
import moment from 'moment';
import UserService from '../services/user';

export default passport => {
    passport.use(new LocalStrategy(
        async function (username, password, done) {
            try {
                const user = await UserService.getUserByUsername(username);

                if (!user) {
                    return done('Username atau Password salah');
                } else {
                    user.comparePassword(password, function (err, isMatch) {

                        if (err)
                            return done(err);

                        if (isMatch) {
                            return done(null, user);
                        } else {
                            return done('Username atau Password salah');
                        }

                    });
                }
            } catch (error) {
                return done(error);
            }
        }
    ));

    passport.use(new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: jwtSecretKey
    }, async function (payload, done) {
        if (moment().unix() > payload.exp) {
            return done('Waktu Sign In Anda telah habis');
        }

        return done(null, payload);
    }));
};