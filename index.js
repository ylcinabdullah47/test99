const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();

app.use(express.static('public'))
const urlencodedParser = bodyParser.urlencoded({ extended: false });


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

  app.post('/submit-form', urlencodedParser, function(req, res) {
    let adsoyad = req.body.adsoyad;
    let mail = req.body.mail;
    let tel = req.body.tel;
    let adres = req.body.adres;
    let pozisyon = req.body.pozisyon;
    let istihdamdurumu = req.body.istihdamdurumu;
    let ozgecmis = req.body.ozgecmis;
    let notlar = req.body.notlar;
  
    let sql = "INSERT INTO basvuru (adsoyad, mail, tel, adres, pozisyon, istihdamdurumu, ozgecmis, notlar) VALUES('" + adsoyad + "', '" + mail + "', '" + tel + "', '" + adres + "', '" + pozisyon + "', '" + istihdamdurumu + "', '" + ozgecmis + "', '" + notlar + "')";

    conneciton.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Başarılı 1 kayıt eklendi");
        res.send("Form gönderildi");


        });
        });
    app.get('/listele', (req, res) => {
            const sql = 'SELECT * FROM basvuru';
            conneciton.query(sql, (err, result) => {
              if (err) throw err;
              console.log(result);
              res.send(result);
            });
          });
    
app.listen(4000,(req,res)=>{
    console.log("4000 portu dinleniyor");
})