const client = require('./MySQLUtil');

const queryUserByUid = function (uid) {
    const sql = "select * from enablermap.user where uid = " + "'" + uid + "'" + ";";
    return pros(sql);
}

const insertUser = function (userInfo) {
    const sql = "insert ignore into enablermap.user values (" + "'" + userInfo.uid + "'," + "'" + userInfo.mailAddress + "'," + "'" + userInfo.password + "'," + "'" + userInfo.role + "'," + "'" + userInfo.displayicon + "'," + "'" + userInfo.displaycolor + "'" + ");"
    return pros(sql);
}

const updateUserPw = function (userInfo){
    const sql = "update enablermap.user set upassword = "+"'"+userInfo.password + "'" + "where uid ="+"'"+userInfo.uid + "';"
    return pros(sql);
}

const checker = function (mail){
    const sql = "select uid,pwd from enablermap.user where mail ="+"'"+mail+"';"
    return pros(sql);
}

const pros = function (sql) {
    return new Promise((resolve, reject) => {
        client.connection.query(sql, (error, result, fields) => {
            if (error) {
                console.log(error.message);
                reject(error.message);
            } else {
                resolve(result);
            }
        });
    })
};



module.exports = {
    queryUserByUid,
    insertUser,
    updateUserPw,
    checker
}
