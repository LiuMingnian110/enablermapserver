const redis = require('redis');
const async = require('async');
const config = require('../config/pathsetting')


const client = redis.createClient({"host": config.redis_host, "port": config.redis_port});

client.on('error',function (err){
    console.log('Redis Connection error:event - ' + client.host + ':' + client.port + '-' +err);
})

//hgetall
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

//hmset
client.synPost = (uid,data)=>{
    client.hmset(uid,data,function (err){
        if(err){
            console.error(err);
        }
    });
}

//set
client.Post = (uid,data)=>{
    client.set(uid,data,function (err){
        if(err){
            console.error(err);
        }
    });
}

//mget
client.synMGet = async(keys) => {
    const newMGet = async(keys) => {
        let val = await new Promise((resolve => {
            client.mget(keys,function (err, res){
                return resolve(res);
            });
        }));
        return val;
    };
    return await newMGet(keys);
}

module.exports = {
    client,
};
