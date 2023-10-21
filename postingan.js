const multer  = require('multer')
const {  SliderPertama ,SliderKedua } = require('./model'); // Import model User
const cloudinary = require('cloudinary').v2;

const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
})

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true,
});
  
const uploadPost = multer({ storage })

const upload_postingan = async (req, res) =>{
    try{
        const firstSlider = []
        const secondSlider = []
        const postingan1 = req.files['sliderPertama'];
        const postingan2 = req.files['sliderKedua']

        const uploadImages = async(images, arrayTujuan) => {
            try{
                for (const e of images){
                    const item = await cloudinary.uploader.upload(e.path);
                    arrayTujuan.push(item.secure_url)
                }
            }catch (error){
                console.error("Gagal mengunggah gambar:", error);
            }

            console.log(`Semua gambar telah diunggah`)
        }

        if (postingan1) {
            const existingData = await SliderPertama.findOne({});
            await uploadImages(postingan1, firstSlider);
          
            if (!existingData) {
              const foto = new SliderPertama({
                foto: firstSlider,
                frame: [
                    'frame/2.png',
                    'frame/3.png',
                    'frame/4.png',
                    'frame/5.png',
                    'frame/6.png',
                    'frame/7.png',
                ]
              });
              await foto.save();
            }else{
                await SliderPertama.findOneAndUpdate({},{$set: {foto: firstSlider}})
            }
        } else if (postingan2) {
            const existingData = await SliderKedua.findOne({});

            await uploadImages(postingan2, secondSlider);
          
            if (!existingData) {
              const foto = new SliderKedua({
                    foto: secondSlider,
                    frame:[
                        'frame2/1.png',
                        'frame2/2.png',
                        'frame2/3.png',
                        'frame2/4.png',
                        'frame2/5.png',
                        'frame2/6.png',
                        'frame2/7.png',
                        'frame2/8.png',
                    ]
              });
              await foto.save();
            }else{
                await SliderKedua.findOneAndUpdate({},{$set: {foto: secondSlider}})
            }
          }
        res.redirect('/admin')
    }catch(error){
        console.log(`Error terjadi di multer upload_postingan: ${error}`)
        res.status(500).send('Terjadi kesalahan saat mengunggah postingan.');
    }
}

module.exports = {uploadPost, upload_postingan}
