const
  mongoose = require('mongoose'),
  express = require('express'),
  compression = require('compression'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  shortid = require('./shortid'),
  Site = require('./Site'),
  uuid = require('uuid/v4');

mongoose.Promise = Promise;

var existing = []; // List of existing codes. Last month or 5000


var app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({type: 'application/json'}));
app.use(cookieParser());
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
  let cookie = req.cookies.user_cookie || uuid();
  let expiry = new Date();
  expiry.setFullYear(expiry.getFullYear() + 5);
  res.cookie('user_cookie', cookie, {secure: false, expires: expiry});
  next();
});

app.post('/', (req, res) => {
  shortid.generate(existing)
    .then(code => {
      existing.push(code);
      return Site.create({
        url: req.body.url,
        code,
        user_agent: req.headers['user-agent'],
        user_ip: req.ip,
        user_cookie: req.cookies.user_cookie
      });
    })
    .then(site => res.send({code: site.code}))
    .catch(err => console.error(err));
});

app.get('/:code', (req, res) => {
  Site.findOne({code: req.params.code}).exec()
    .then(site => {
      if(!site) res.redirect('/');
      else {
        site.views++;
        return site.save();
      }
    })
    .then(site => {
      site.url.match(/(:\/\/)/i) ? res.redirect(site.url) : res.redirect('https://' + site.url);
    })
    .catch(err => res.redirect('/'));
});

app.get('/:code/info', (req, res) => {
  Site.findOne({code: req.params.code}).exec()
    .then(site => {
      if(!site) res.send('no info');
      else res.json(site);
    })
    .catch(err => res.send(err));
});

app.get('/sites/count', (req, res) => {
  Site.count({}).exec()
    .then(count => res.json(count))
    .catch(err => res.send(err));
});

app.get('/sites/:count?', (req, res) => {
  let limit = +req.params.count || 20;

  Site.find({}).limit(limit).sort('-date_created').exec()
    .then(sites => res.json(sites))
    .catch(err => res.send('nothing to see here'));
});


const db = process.env.ZIIP_DB || 'mongodb://localhost/ziip';
mongoose.connect(db);
mongoose.connection.on('open', () => {
  console.log(`mongo connected`);
  let aMonthAgo = new Date();
  aMonthAgo.setDate(aMonthAgo.getMonth() - 1);
  Site.find({date_created: {$gt: aMonthAgo}}).limit(5000).exec()
    .then(sites => sites.map(site => existing.push(site.code)));
});

const port = process.env.ZIIP_PORT || 9000;
app.listen(port, () => console.log(`started on ${port}`));