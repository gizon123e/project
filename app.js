const express = require('express')
const passport = require('passport')
const CryptoJS = require('crypto-js')
const nodemailer = require('nodemailer');
const notifier = require('node-notifier');
const app = express()
const session = require('express-session');
const login = require('./loginRoute')
const {uploadPost, upload_postingan} = require('./postingan')
const { User, Foto, Kata, Pertanyaan, SliderPertama, SliderKedua } = require('./model');
const flash = require('connect-flash')
require('./passport.js')
const db = require('./db')


app.set("views", "views");
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use('/postingan', express.static("postingan"));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.get('/', async (req, res)=>{
    if(!req.isAuthenticated()){
        res.send(
            `Kamu belum login, ini website private. 
            Masukkan dulu credential 
            <a href="/login" style="font-weight: Bold; text-decoration: none; color: black;">LOGIN</a>`
        )
    }else{
        const successMessage = req.flash('success'); // Mengambil pesan flash pertama
        const sliderPertama = await SliderPertama.findOne({})
        const sliderKedua = await SliderKedua.findOne({})
        const adaKata = await Kata.findOne({})
        const adaPertanyaan = await Pertanyaan.findOne({})
        if(!sliderPertama || !sliderKedua || !adaKata || !adaPertanyaan){
            res.render('index',{
                sliderPertama: undefined,
                framePertama: undefined,
                sliderKedua: undefined,
                frameKedua: undefined,
                kata: undefined,
                pertanyaan: undefined,
                successMessage
            })
        }else{
            res.render('index', {
                sliderPertama: sliderPertama.foto,
                framePertama: sliderPertama.frame,
                sliderKedua: sliderKedua.foto,
                frameKedua: sliderKedua.frame,
                kata: adaKata.kataKata,
                pertanyaan: adaPertanyaan.question,
                successMessage
            })
        }
    }
})
app.get('/admin', (req, res)=>{
    res.render('admin')
})

app.post('/send-email', (req, res)=>{
    const jawaban = req.body.text
    const pertanyaan = req.body.question

    const hasil = `Halo Fuad, ini ada jawaban jawaban dari pertanyaan mu\n${pertanyaan.map((e, i) => `${e}: ${jawaban[i]}`).join('\n')}`
    console.log(hasil)

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: process.env.RECEIVER_EMAIL,
        text: hasil
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
        } else {
            console.log('Email sent: ' + info.response);
            // Tampilkan notifikasi
            notifier.notify({
                title: 'Email Status',
                message: 'Email berhasil terkirim!'
            });
            res.redirect('/')
        }
    });
    
})

app.post('/admin/kata', async(req, res)=>{
    try{
        const adaKata = await Kata.findOne({})
        if(!adaKata){
            const kata_kata = new Kata({
                kataKata: req.body.pesan
            })
        
            req.flash('success', 'Data berhasil disimpan');
            await kata_kata.save()
        }else{
            await Kata.findOneAndUpdate({},{
                kataKata: req.body.pesan
            })
            req.flash('success', 'Data berhasil disimpan');
        }
        res.redirect('/admin')
    }catch(err){
        res.json(err)
    }  
})
app.post('/admin/question', async(req, res)=>{
    try{
        const questions = await Pertanyaan.findOne({})
        if(!questions){
            const pertanyaan = new Pertanyaan({
                question: req.body.question
            })
        
            req.flash('success', 'Data berhasil disimpan');
            await pertanyaan.save()
        }else{
            await Pertanyaan.findOneAndUpdate({},{
                question: req.body.question
            })
            req.flash('success', 'Data berhasil disimpan');
        }
        res.redirect('/admin')
    }catch(err){
        res.json(err)
    }  
})
app.post('/admin', uploadPost.fields([{name: 'sliderPertama', maxCount: 6}, {name: 'sliderKedua', maxCount: 8}]), upload_postingan)
app.get('/signup', (req, res)=>{
    res.render('signup')
})
app.post('/signup', async (req, res)=>{
    try {
        const connection = await connect();
        const {username, password} = req.body;
        // password = CryptoJS.AES.encrypt(password, 'secret key 123').toString() // Pastikan password dienkripsi dengan benar di sini
        // Buat pengguna baru
        const dibuat = new User({
            username,
            password: CryptoJS.AES.encrypt(password, 'secret key 123').toString()
        });
    
        // Simpan pengguna baru
        await dibuat.save();
        res.redirect('/login')
      } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Terjadi kesalahan saat mendaftar' + error});
      }
})
app.use('/login', login)

db()
  .then(()=>{
    app.listen(3000, function () {
      console.log('Listening on http://localhost:3000');
    });
  })
