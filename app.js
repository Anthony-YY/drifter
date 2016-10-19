/**
 * Created by Anthony-YY on 2016/10/13.
 */
var express = require('express');
var redis = require('./models/redis');
var bodyParser = require('body-parser');
var mongodb = require('./models/mongodb.js');
var app = express();
var port = process.env.PORT || 3000;

app.use(bodyParser());

app.post('/', function (req, res) {
    console.log('request coming in...');
    if(! (req.body.owner && req.body.type && req.body.content)){
        if( ['male', 'female'].indexOf(req.query.type) < 0 ) {
            return res.json({code: 0,msg: '类型错误'});
        }
        res.json({code: 0, msg: '信息不完整'});
    }
    redis.throw(req.body, function (result) {
        res.json(result);
    });
});

app.get('/', function (req, res) {
    if(!req.query.user) {
        return res.json({code: 0,msg: '信息不完整'});
    }
    if(req.query.type && ['male','female'].indexOf(req.query.type) === -1){
        res.json({code: 0, msg: '信息不完整'});
    }
    redis.pick(req.query, function(result){
        if(result.code === 1){
            mongodb.save(req.query.user, result.msg, function (err) {
                if(err) {
                    res.json({code: 1, msg: '获取漂流瓶信息失败,请重试'});
                }
                return res.json(result);
            })
        }
        res.json(result);
    });
});

app.get('/user/:user', function (req, res) {
    mongodb.getAll(req.params.user, function (result) {
        res.json(result);
    });
});

app.post('/back', function (req, res) {
    redis.throwBack(req.body, function (result) {
        res.json(result);
    });
});

app.get('/bottle/:_id', function (req, res) {
    mongodb.getOne(req.params._id, function (result) {
        res.json(result);
    });
});

app.post('/reply/:_id', function(req, res){
    if(!(req.body.user && req.body.content)){
        return callback({code: 0,msg: "回复信息不完整"});
    }
    mongodb.reply(req.param._id, req.body, function (result) {
        res.json(result);
    })
});

app.get('/delete/:_id', function (req, res) {
    mongodb.delete(req.params._id, function (result) {
        callback(result);
    });
});

app.listen(port, function () {
    console.log('server running at port ' + port);
});