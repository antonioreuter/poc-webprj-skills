// Runs before every test file. Provide a valid env so config parsing succeeds
// without a real .env; tests inject fakes instead of touching the database.
process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'silent';
process.env.DATABASE_URL ??= 'postgres://app:app@localhost:5432/app_test';
