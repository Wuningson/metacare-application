const ErrorResponse = (res, err, code, status = 'failed') => {
  res.statusCode = code;

  let error = {
    status,
    message:
      err instanceof Error
        ? err.message
        : typeof err === 'string'
        ? err
        : 'Something went wrong'
  };

  return res.status(code).json(error);
};

const SuccessResponse = (
  res,
  message,
  data,
  code = 200,
  status = 'successful'
) => {
  let sendData = {
    data,
    status,
    message
  };

  res.statusCode = code;

  return res.json(sendData);
};

module.exports = {
  ErrorResponse,
  SuccessResponse
};
