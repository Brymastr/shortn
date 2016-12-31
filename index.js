const
  mongoose = require('mongoose'),
  express = require('express'),
  http = require('http'),
  bodyParser = require('body-parser'),
  Site = require('./site');


var app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json({type:'application/json'}));

app.use('*', (req, res, next) => {
  req.method === 'POST' ? console.dir(`${req.method}: ${req.body.url}`) : console.log(`${req.method}: ${req.baseUrl}`);
  next();
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/', (req, res) => {
  // TODO: everything
  new Site({
    url: req.body.url
  }).save((err, doc) => {
    if(err) console.log(err);
    res.send({
      code: doc.code
    });
  });
});

app.get('/:code', (req, res) => {
  Site.findOne({code: req.params.code}, (err, site) => {
    if(!site) res.send('nope');
    else res.send({
      url: site.url
    });
  });
});

mongoose.connect('mongodb://localhost/shortn');
mongoose.connection.on('open', () => {
  console.log(`mongo connected`);
});

const port = 9000;
app.listen(port, () => {console.log(`started on ${port}`)});