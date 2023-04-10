const express = require('express');
const mysql = require('mysql2');
const nodemailer = require('nodemailer');   
const bodyParser = require('body-parser');
const multer  = require('multer');
// const mongodb = require('./mongodb.js');
require('dotenv').config();

const fs = require('fs');

const app = express();
// const upload = multer({ dest: 'uploads/' });
app.use(express.static('public'))
const urlencodedParser = bodyParser.urlencoded({ extended: false });
// app.use(multer({ dest: '/tmp/' }).single('ozgecmis'));
// Storage nesnesi
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now());
    }
  });
  
  // Upload nesnesi
  const upload = multer({ storage: storage });
const conneciton =mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"taslak0",
    port: '3306',
    insecureAuth : true
});

conneciton.connect((err)=>{
    if(err){
        console.log("MySQL veritabanına bağlanırken hata oluştu");  
    return;
  }
  console.log("MySQL veritabanına bağlı!");
})



app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/form.html');
  });


  // MYSQL VERİ KAYIT YAPILAN YER
//   app.post('/submit-form', urlencodedParser, function(req, res) {
//     let adsoyad = req.body.adsoyad;
//     let mail = req.body.mail;
//     let tel = req.body.tel;
//     let adres = req.body.adres;
//     let pozisyon = req.body.pozisyon;
//     let istihdamdurumu = req.body.istihdamdurumu;
//     let ozgecmis = req.body.ozgecmis;
//     let notlar = req.body.notlar;
  
//     let sql = "INSERT INTO basvuru (adsoyad, mail, tel, adres, pozisyon, istihdamdurumu, ozgecmis, notlar) VALUES('" + adsoyad + "', '" + mail + "', '" + tel + "', '" + adres + "', '" + pozisyon + "', '" + istihdamdurumu + "', '" + ozgecmis + "', '" + notlar + "')";

//     conneciton.query(sql, function (err, result) {
//         if (err) throw err;
//         console.log("Başarılı 1 kayıt eklendi");
//         res.send("Form gönderildi");


//         });
//         });
   


// // MYSQL OLAN VERİLERİ LİSTELEMEK İÇİN KULLANILAN
// app.get('/listele', (req, res) => {
//             const sql = 'SELECT * FROM basvuru';
//             conneciton.query(sql, (err, result) => {
//               if (err) throw err;
//               console.log(result);
//               res.send(result);
//             });
//           });
//  Dosya yükleme ayarları


app.post('/submit-form', upload.single('ozgecmis'),urlencodedParser, function(req, res) {
    let adsoyad = req.body.adsoyad;
    let mail = req.body.mail;
    let tel = req.body.tel;
    let adres = req.body.adres;
    let pozisyon = req.body.pozisyon;
    let istihdamdurumu = req.body.istihdamdurumu;
    // let ozgecmis = req.body.ozgecmis;
    let notlar = req.body.notlar;
  
    let mailTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });
    
    // Özgeçmiş: ${ozgecmis}
    let mailDetails = {
      from: 'mail_adresi',
      to: 'proder4747@gmail.com',
      subject: 'Başvuru Formu',
      text: `
        Ad Soyad: ${adsoyad}
        Mail: ${mail}
        Telefon: ${tel}
        Adres: ${adres}
        Pozisyon: ${pozisyon}
        İstihdam Durumu: ${istihdamdurumu}
        Notlar: ${notlar}
        Ozgecmis: ${req.file.filename} 
      `,
      attachments: [
        {
          filename: req.file.filename,
          path: req.file.path
        }
      ]
    };
    
    mailTransporter.sendMail(mailDetails, function(err, data) {
        if (err) {
          console.log('Hata oluştu: ' + err);
        } else {
          console.log('Mail gönderildi: ' + data.response);
          res.send('Form gönderildi');
        }
      });
    });


app.listen(4000,(req,res)=>{
    console.log("4000 portu dinleniyor");
})