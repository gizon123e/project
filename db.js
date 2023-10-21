const mongoose = require('mongoose');

async function main() {
    await mongoose.connect('mongodb+srv://muhammadnurfisyalt:isal070705@cluster0.r4zv3uh.mongodb.net/content?retryWrites=true&w=majority')
        .then(()=>{
            console.log('berhasil terhubung')
        })
}
main()
