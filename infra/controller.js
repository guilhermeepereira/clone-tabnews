import { InternalServerError, MethodNotAllowedError } from "infra/errors";

function onError(error, request, response) {
  const publicOnErroObject = new InternalServerError({
    cause: error,
    statusCode: error.statusCode || 500,
  });
  response.status(publicOnErroObject.statusCode).json(publicOnErroObject);
  console.log("\nErro no controller: ");
  console.log(publicOnErroObject);
}

function onNoMatch(request, response) {
  const publicOnNoMatchObject = new MethodNotAllowedError();
  response.status(publicOnNoMatchObject.statusCode).json(publicOnNoMatchObject);
}

const errorsHandler = {
  onError: onError,
  onNoMatch: onNoMatch,
};

export default errorsHandler;
