const
  mongoose = require('mongoose'),
  express = require('express'),
  http = require('http'),
  bodyParser = require('body-parser'),
  shortid = require('./shortid'),
  Site = require('./Site');

var existing = []; // List of existing codes. Last month or 5000

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
  let code = shortid.generate(existing);

  new Site({
    url: req.body.url,
    code: code
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
    else res.redirect(site.url);
  });
});

mongoose.connect('mongodb://localhost/shortn');
mongoose.connection.on('open', () => {
  console.log(`mongo connected`);
  let aMonthAgo = new Date();
  aMonthAgo.setDate(aMonthAgo.getMonth() - 1);
  Site.find({date_created: {$gt: aMonthAgo}}).limit(5000).exec((err, sites) => {
    sites.map(site => existing.push(site.code));
  });
});

const port = 9000;
app.listen(port, () => {console.log(`started on ${port}`)});