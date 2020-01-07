const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mysql = require('mysql');
//const bootstrap = require('bootstrap');
const connection = require("./connection");

const app = express();
const xlsx = require('xlsx');
const excelToJson = require('convert-excel-to-json');
const upload = require('express-fileupload');
app.use(upload());
app.use(express.static("public"));

 




// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'mysql',
//   database: 'socka'
// });
//
// connection.connect(function(error){
//   if(!!error) {
//     console.log(error,"www");
//   }
//
//   else{
//     console.log(('Database Connected'))
//   }
//   });






//set views file
app.set('views',path.join(__dirname,'views'));

//set view engine
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));




app.get('/',(req, res) => {
    // res.send('CRUD Operation using NodeJS / ExpressJS / MySQL');
    let sql = "SELECT * FROM excel";
    let query = connection.query(sql, (err, rows) => {
        if(err) throw err;
        res.render('user_index', {
            title : 'Meltwater Feed',
            users : rows
        });
    });
});


app.get('/add',(req, res)=>{
    res.render('user_add', {
        title : 'Add Articles'
    });
});




app.post('/save',(req,res) => {
    let data = {name: req.body.name, class: req.body.email, regno: Math.floor(Math.random() * 9999999) + 1847100};
    let sql = "INSERT INTO excel SET ?";
    let query = connection.query(sql, data,(err, results)=>{
        if(err) throw arr;
        res.redirect('/');
    });
});


app.get('/edit/:id',(req, res)=>{
    const userId = req.params.id;
    let sql = `SELECT * FROM excel where id = ${userId}`;
    let query = connection.query(sql,(err, result)=>{
        if(err) throw err;
        res.render('user_edit', {
            title : 'Edit Sources',
            user : result[0]
        });
    });
});


app.post('/update',(req, res)=>{
    const userId = req.body.id;
    let sql = "update excel SET name='"+req.body.name+"', class='"+req.body.class+"', regno='"+req.body.regno+"' where id = "+userId;
    let query = connection.query(sql,(err, results) => {
        if(err) throw err;
        res.redirect('/');
    });
});


app.get('/delete/:id',(req, res)=>{

    const userId = req.params.id;
    let sql = `delete FROM excel where id = ${userId}`;
    let query = connection.query(sql,(err, result)=>{
        if(err) throw err;
        res.redirect('/');
    });
});


app.post('/ss',(req, res) => {



    // if(!req.files){
 //   res.send("<h1>Invalid Input</h1>");
    // }else {
        const file = req.files.filename;
    const filename = file.name;
    file.mv("./uploads/"+filename);
    // }




        let matched = 0;
        let not_matched = 0;
        const workbook = xlsx.readFile("./uploads/"+filename);
        const sheet_name_list = workbook.SheetNames;
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
        const totalSources = data.length;


        let sql = `SELECT name FROM excel`;
        let query = connection.query(sql, (err, result) => {

            if (err) throw err;
            //retrive every line
            Object.keys(result).forEach(function (key) {
                let row = result[key];
                // console.log(row.name);

                for (let keyss in data) {
                    if (data[keyss]['NAME'] !== row.name) {

                    } else {
                        matched = matched + 1;
                        //console.log("hey ",row.name)

                    }
                }
            });

            // res.send("<h1>You have connected "+matched+ " times</h1>");
            res.render('success_page', {
                title: 'RESULTS',
                matched: matched,
                not_matched: totalSources - matched
            });

        });


// res.send("<h1>You have connected "+matched+ " times </h1>");


//     const result = excelToJson({
//     sourceFile: 'khokho.xlsx'
//     //     header:{
//     //     rows: 1, //2 , 3, 4,
//     // }
// });
//     console.log(result);

});


//FOR SHEETS MODIFICATIONS ADD DELETE CALXULATIONS

// const newData = data.map(function (record){
//  record.Net = record.Sales - record.Cost;
//  delete record.Sales;
//  delete record.Cost;
//  return record;
// });


//Creating new

// const newWB = xlsx.utils.book_new();
// const newWS = xlsx.utils.json_to_sheet(newData);
// xlsx.utils.book_append_sheet(newWs,"NEW_Data_Name");

//xlsx,writwFile(newWB, "New_DATA_FIle.xlsx");





//File uploading

app.get('/uploadfiles',(req, res)=>{
    res.render('upload_files', {
        title : 'UPLOAD FILES'
    });
});


app.post('/uploadfiles',function (req,res) {
if(req.files){
    const file = req.files.filename;
    const filename = file.name;
    file.mv("./uploads/"+filename,function (err) {
        if(err){
            console.log(err);
            res.send("error occured");
        }else{
            res.send("DONE!");
        }
    });
}
});

app.listen(3001, () => {
  console.log("running");
});
module.exports = app;
