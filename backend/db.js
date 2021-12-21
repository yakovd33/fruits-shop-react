const Pool = require('pg').Pool;

const pool = new Pool({
    user: 'postgres',
    password: '1070',
    host: 'localhost',
    port: 5432,
    database: 'giveget'
});

module.exports = pool;