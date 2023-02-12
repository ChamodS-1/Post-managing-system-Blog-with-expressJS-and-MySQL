const path = require('path');
const fs = require('fs');

const express = require('express');

const app = express();

app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }));

const mydata = require('./database/database1');


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')


app.get('/blog-home', function (req, res) {

    res.render('main');

});

app.get('/create-post', async function (req, res) {

    mydata.query('select * from authors', function (err, result, fields) {

        const x = result;
        res.render('post', { keys: x });

    });

});

app.post('/create-post', function (req, res) {

    const data = [

        req.body.titlepost,
        req.body.titlesummery,
        req.body.postcontent,
        req.body.select,
    ];

    mydata.query('insert into posts (title,summery,body,author_id) values (?)', [data]);

    res.redirect('/success');

});

app.get('/success', function (req, res) {

    res.render('successful');

});

app.get('/updated', function (req, res) {

    res.render('updated');

});

app.get('/deleted', function (req, res) {

    res.render('deleted');

});

app.get('/all-post', function (req, res) {

    mydata.query('select posts.*,authors.*,posts.id as post_id from authors inner join posts on posts.author_id=authors.id', function (err, result, fields) {

        const x = result;
        const length = x.length;
        res.render('allpost', { alenght: length, keys: x });

    });

});

app.get('/all-post/:id', function (req, res) {

    const newID = req.params.id;

    mydata.query('select posts.*,authors.* from authors inner join posts on posts.author_id=authors.id where posts.id=?', [newID], function (err, result, fields) {

        //console.log(result);

        /* const postData = {
             ...result,
             date : result.date.toISOString(),
             humanRead : result.date.toLocalDateString('en-US',{
 
                 weekday :'long',
                 year : 'numeric',
                 month : 'long',
                 day :'numeric'
 
             }),
 
         };*/

        res.render('viwpost', { keys: result });
    });

});


app.get('/edite/:id', function (req, res) {

    const newID = req.params.id;

    mydata.query('select posts.*,authors.*, posts.id as post_id from authors inner join posts on posts.author_id=authors.id where posts.id=?', [newID], function (err, result, fields) {

        res.render('edite', { keys: result });

    });

});

app.post('/edite/:id', function (req, res) {

    const newID = +req.params.id;
    const title = req.body.titlepost;
    const summery = req.body.titlesummery;
    const postcontent = req.body.postcontent;
    
    mydata.query('update posts set title=?,summery=?,body=? where id=?', [title,summery,postcontent,newID], function (err) {

        if (err) {
            console.log(err);
        }
        else {
            res.redirect('/updated');
        }


    });
});


app.get('/delete/:id', function (req, res) {

    const newID = req.params.id;

    mydata.query('delete from posts where id=?', [newID], function (err) {

        if (err) {
            console.log(err);
        }
        else {
            res.redirect('/deleted');
        }
    });

});


app.use(function (req, res) {

    res.render('404');

});

app.listen(3000);