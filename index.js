const
  mongoose = require('mongoose'),
  express = require('express'),
  compression = require('compression'),
  http = require('http'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  shortid = require('./shortid'),
  Site = require('./Site'),
  uuid = require('node-uuid');

mongoose.Promise = Promise;


var existing = []; // List of existing codes. Last month or 5000

const db = process.env.ZIIP_DB || 'mongodb://localhost/ziip';

var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({type: 'application/json'}));
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));
app.use(compression());

app.use('*', (req, res, next) => {
  req.method === 'POST' ? console.dir(`${req.method}: ${req.body.url}`) : console.log(`${req.method}: ${req.baseUrl}`);
  next();
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use((req, res, next) => {
  let cookie = req.cookies.user_cookie || uuid.v4();
  let expiry = new Date();
  expiry.setFullYear(expiry.getFullYear() + 5);
  res.cookie('user_cookie', cookie, {secure: false, expires: expiry});
  next();
});

app.post('/', (req, res) => {
  let code = shortid.generate(existing);
  console.log(req.cookies)
  new Site({
    url: req.body.url,
    code: code,
    user_agent: req.headers['user-agent'],
    user_ip: req.ip,
    user_cookie: req.cookies.user_cookie
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
    else {
      site.views++;
      site.save((err, doc) => {
        site.url.match(/(:\/\/)/i) ? res.redirect(site.url) : res.redirect('https://' + site.url);
      });
    }
  });
});

app.get('/:code/info', (req, res) => {
  Site.findOne({code: req.params.code}, (err, site) => {
    if(!site) res.send('nope');
    else res.json(site);
  });
});

app.get('/sites/count', (req, res) => {
  Site.count({}).then(count => res.json(count));
});

app.get('/sites/:count?', (req, res) => {
  let limit = +req.params.count || 20;
  Site.find({})
    .limit(limit)
    .sort('-date_created')
    .then(sites => res.json(sites))
    .catch(err => console.log(err));
});

app.get('/', (req, res) => {
  res.send('./public/index.html');
});

mongoose.connect(db);
mongoose.connection.on('open', () => {
  console.log(`mongo connected`);
  let aMonthAgo = new Date();
  aMonthAgo.setDate(aMonthAgo.getMonth() - 1);
  Site.find({date_created: {$gt: aMonthAgo}}).limit(5000).exec((err, sites) => {
    sites.map(site => existing.push(site.code));
  });
});

const port = process.env.ZIIP_PORT || 9000;
app.listen(port, () => {console.log(`started on ${port}`)});