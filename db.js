const mongoose = require('mongoose');

async function main() {
    await mongoose.connect(process.env.MONGO_URI)
        .then(()=>{
            console.log('berhasil terhubung')
        })
}

module.exports = main
