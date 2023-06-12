import AuthRequiredError from '../../presentation/errors/auth-required-error.js';
import JwtAdapter from '../../data-access/auth/jwt-adapter.js';
import envConfig from '../config/env/env.js';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader ? authHeader.split(' ')[1] : null;
  if (!token) return next(new AuthRequiredError());

  const jwt = new JwtAdapter(envConfig.secrets.jwt, envConfig.secrets.jwtExp);
  const decoded = await jwt.verify(token);
  if (!decoded) return next(new AuthRequiredError('Failed to authenticate'));

  req.authUser = decoded;
  next();
};
