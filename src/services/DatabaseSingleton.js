const { PrismaClient } = require("@prisma/client");

class DatabaseSingleton {
  constructor() {
    this.prisma = new PrismaClient();
  }
}

const instance = new DatabaseSingleton();

module.exports = instance;
