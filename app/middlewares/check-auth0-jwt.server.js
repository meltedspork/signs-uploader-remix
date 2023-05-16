import { expressjwt as expressJwt } from 'express-jwt';
import jwksRsa from 'jwks-rsa';

const checkJwt = expressJwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: process.env.AUTH0_JWKS_URI,
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: process.env.AUTH0_ISSUER,
  algorithms: process.env.AUTH0_ALGORITHMS.split(','),
}).unless({
  path: ['/']
});

export default checkJwt;
