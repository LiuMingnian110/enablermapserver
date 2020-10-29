const redis = require('redis');
const async = require('async');


const client = redis.createClient({"host": "127.0.0.1", "port": "6379"});

client.on('error',function (err){
    console.log('Redis Connection error:event - ' + client.host + ':' + client.port + '-' +err);
})

client.synGet = async(key) => {
    const newGet = async(key) => {
        let val = await new Promise((resolve => {
            client.hgetall(key,function (err, res){
                return resolve(res);
            });
        }));
        return val;
    };
    return await newGet(key);
}

client.synPost = (uid,data)=>{
    client.hmset(uid,data,function (err){
        if(err){
            console.error(err);
        }
    });
}

module.exports = {
    client,
};