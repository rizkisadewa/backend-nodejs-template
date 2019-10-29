import passport from 'passport';
import ResponseUtil from '../utils/response';
import jwt from 'jsonwebtoken';
import {
    jwtExpiration,
    jwtSecretKey
} from '../config/jwt';
import {
    body,
    validationResult
} from 'express-validator';

const resUtil = new ResponseUtil();

class AuthController {
    static async signIn(req, res) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                throw errors.array()[0].msg;
            }

            passport.authenticate('local', {
                session: false
            }, function (err, result) {
                if (err) {
                    resUtil.setError(400, err);
                }

                if (result) {
                    const token = jwt.sign(JSON.parse(JSON.stringify(result)), jwtSecretKey, {
                        expiresIn: jwtExpiration
                    });

                    resUtil.setSuccess(200, 'User berhasil sign in', {
                        token: token
                    });
                }

                return resUtil.send(res);
            })(req, res);
        } catch (error) {
            resUtil.setError(400, error);
            return resUtil.send(res);
        }
    }

    static validate(method) {
        switch (method) {
            case 'sign-in': {
                return [
                    body('username').not().isEmpty().withMessage('Username harus diisi'),
                    body('username').isLength({
                        min: 5
                    }).withMessage('Username harus berisi 5 karakter'),
                    body('password').not().isEmpty().withMessage('Password harus diisi'),
                    body('password').isLength({
                        min: 6
                    }).withMessage('Password minimal berisi 6 karakter')
                ]
            }
        }
    }

    static async verifyJwt(req, res, next) {
        try {
            passport.authenticate('jwt', {
                session: false
            }, function (err, result) {
                if (err) {
                    resUtil.setError(400, err);
                }

                if (!result) {
                    resUtil.setError(400, 'User tidak memiliki hak akses');
                }

                if (err || !result) {
                    return resUtil.send(res);
                }

                req.user = result;
                next();
            })(req, res, next);
        } catch (error) {
            resUtil.setError(400, error);
            return resUtil.send(res);
        }
    }
}
export default AuthController;