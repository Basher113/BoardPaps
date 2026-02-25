const { PrismaClient } = require('../../generated/prisma');
const {PrismaPg} = require("@prisma/adapter-pg");

require("dotenv").config();

// Select database URL based on environment
const getConnectionString = () => {
  if (process.env.NODE_ENV === 'test') {
    return process.env.TEST_DATABASE_URL;
  }
  if (process.env.NODE_ENV === 'production') {
    return process.env.DATABASE_URL_PROD || process.env.DATABASE_URL;
  }
  // Development environment
  return process.env.DATABASE_URL_DEV || process.env.DATABASE_URL;
};

const connectionString = getConnectionString();

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({adapter});

module.exports = prisma;