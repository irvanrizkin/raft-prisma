const CustomError = require("./CustomError");

class ErrorHandler {
  static handleError(error, req, res, next) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({
        status: false,
        message: error.message
      });
    }

    return res.status(500).json({
      status: false,
      message: error.message
    });
  }
}

module.exports = ErrorHandler;
