import { InternalServerError, MethodNotAllowedError } from "infra/errors";

function onError(error, request, response) {
  const publicError = new InternalServerError({
    cause: error,
  });
  response.status(publicError.statusCode).json(publicError);
}

function onNoMatch(request, response) {
  const publicMethodError = new MethodNotAllowedError();
  response.status(publicMethodError.statusCode).json(publicMethodError);
}

export { onError, onNoMatch };
