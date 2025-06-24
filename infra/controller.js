import { InternalServerError, MethodNotAllowedError } from "infra/errors";

function onError(error, request, response) {
  const publicError = new InternalServerError({
    cause: error,
  });
  response.status(publicError.statusCode).json(publicError);
  console.log(error);
}

function onNoMatch(request, response) {
  const publicMethodError = new MethodNotAllowedError();
  response.status(publicMethodError.statusCode).json(publicMethodError);
}

const errorsHandler = {
  onError: onError,
  onNoMatch: onNoMatch,
};

export default errorsHandler;
