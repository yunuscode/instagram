const mongoose = require('mongoose')


async function client() {
    return await mongoose.connect('mongodb://localhost/instagram', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    });
}

module.exports = client