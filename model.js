const mongoose = require('mongoose');
const { Schema } = mongoose;

const user = new Schema({
  username: String,
  password: String,
});

const kata = new Schema({
  kataKata: Array
})

const pertanyaan = new Schema({
  question: Array
})
const sliderPertama = new Schema({
  foto: Array,
  frame: Array
})
const sliderKedua = new Schema({
  foto: Array,
  frame: Array
})

const User = mongoose.model('User', user);
const Pertanyaan = mongoose.model('Pertanyaan', pertanyaan);
const SliderPertama = mongoose.model('SliderPertama', sliderPertama)
const SliderKedua = mongoose.model('SliderKedua', sliderKedua)
const Kata = mongoose.model('Kata', kata)

module.exports = {User, Pertanyaan, Kata, SliderPertama, SliderKedua}