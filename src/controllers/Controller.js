const instance = require("../services/DatabaseSingleton");

class Controller {
  constructor() {
    this.prisma = instance.prisma;
  }

  sendResponse(res, status, message, results) {
    return res.status(status).json({
      status,
      message,
      results,
    });
  }
}

module.exports = Controller;
