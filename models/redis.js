/**
 * Created by Anthony-YY on 2016/10/13.
 */
var redis = require('redis'),
    client = redis.createClient(50,3170,{auth_pass:'9694d5e0e49ff573e3e60f64a7054183'}),
    client2= redis.createClient(50,3170,{auth_pass:'9694d5e0e49ff573e3e60f64a7054183'}),
    client3 = redis.createClient(50,3170,{auth_pass:'9694d5e0e49ff573e3e60f64a7054183'});

exports.throw = function(bottle, callback){

    client2.SELECT(2, function () {
        client2.GET(bottle.user, function (err, times) {
            if(times > 10){
                return res.json({code: 0,msg: '今天扔瓶子的机会已经用完啦~'});
            }
            client2.INCR(bottle.owner, function () {
                client2.TTL(bottle.owner, function (err,ttl) {
                    if(ttl == -1){
                        client2.EXPIRE(bottle.owner, 86400)
                    }
                });
            });
            bottle.time = bottle.time || Date.now();
            var bottleId = Math.random().toString(16);
            var type = {male: 0,female: 1};

            client.SELECT(type[bottle.type], function () {
                client.HMSET(bottleId, bottle, function (err, result) {
                    if(err) {
                        return callback({code: 0,msg: '过会儿再试试吧'});
                    }
                    callback({code: 1,msg: result});
                    client.EXPIRE(bottleId, 86400);
                })
            })
       });
    });
};

exports.pick = function (info, callback) {

    client3.SELECT(3, function () {
        client3.get(info.user, function (err, times) {
            if(times > 10){
                return callback({code: 0,msg: '今天捡瓶子的机会已经用完啦~'});
            }
            client3.INCR(info.user, function () {
                client3.TTL(info.user, function (err, ttl) {
                    if(ttl == -1){
                        client3.EXPIRE(info.user, 86400);
                    }
                })
            });
            if(Math.random() < 0.2){
                return callback({code: 0, msg: '海星'});
            }

            var type = {'all': Math.round(Math.random()),'male': 0,'female': 1};

            info.type = info.type || 'all';
            client.SELECT(type[info.type], function(){
                client.RANDOMKEY(function (err,bottleId) {
                    if(!bottleId) {
                        return callback({code: 0,msg: '海星'});
                    }
                    client.HGETALL(bottleId, function (err, bottle) {
                        if(err) {
                            return callback({cdoe: 0,msg: '漂流瓶破损了'});
                        }
                        callback({code: 1,msg: bottle});
                        client.DEL(bottleId);
                    });
                });
            });
        })
    });
};

exports.throwBack = function (bottle, callback) {
    var type = {male: 0,female: 1};
    var bottleId = Math.random().toString(16);
    client.SELECT(type[bottle.type], function () {
        client.HMSET(bottleId, bottle, function (err, result) {
            if(err) {
                return callback({code: 0, msg: '过会儿在试试吧'});
            }
            callback({code: 1,msg: result});
            client.EXPIRE(bottleId, bottle.time + 86400000 - Date.now());
        });
    });
};