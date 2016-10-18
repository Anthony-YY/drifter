/**
 * Created by Anthony-YY on 2016/10/13.
 */

var request = require('request');

for(var j=1;j<=5;j++) {

    console.log('request send out...');
    (function (j) {
        request.post({
            'url': 'http://localhost:3000',
            'json': {owner:'Anthony',type:'male',content:'i busy' + j}
        }, function (err,res,data) {
            console.log(res);
        })
    })(j);
}

for(var i=6;i<=10;i++) {
    (function (i) {
        request.post({
            'url': 'http://localhost:3000',
            'json': {owner:'Anthony',type:'female',content:'i busy' + i}
        })
    })(i)
}
