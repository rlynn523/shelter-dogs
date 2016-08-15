var db = process.env.NODE_ENV === 'production' ?
    'mongodb://ryanlynn:rango123@ds145325.mlab.com:45325/heroku_t722w71v' :
    'mongodb://localhost/shelter-dogs';
exports.DATABASE_URL = process.env.DATABASE_URL ||
    global.DATABASE_URL || db;
exports.PORT = process.env.PORT || 8080;
