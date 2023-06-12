import coerceFieldsToString from '../../utils/coerce-fields-to-string.js';

export const adaptRoute = (handler) => {
  return async (req, res, next) => {
    try {
      const httpRequest = {
        // Parse all request body field values to string
        body: coerceFieldsToString(req.body),
        params: req.params,
        authUser: req.authUser,
      };
      const httpResponse = await handler(httpRequest);

      res.status(httpResponse.status).json(httpResponse.body);
    } catch (err) {
      next(err);
    }
  };
};
