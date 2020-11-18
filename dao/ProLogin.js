const client = require('./MySQLUtil');

const queryUserByUid = function (pnumber) {
    const sql = "select * from enablermap.user where pnumber = " + "'" + pnumber + "'" + ";";
    return pros(sql);
}

const insertUser = function (userInfo) {
    const sql = "insert ignore into enablermap.user values (" + "'" + userInfo.uid + "'," + "'" + userInfo.mailAddress + "'," + "'" + userInfo.password + "'," + "'" + userInfo.role + "'," + "'" + userInfo.displayicon + "'," + "'" + userInfo.displaycolor + "'" + ");"
    return pros(sql);
}

const confrimPw = function (userInfo) {
    const sql = "select pwd from enablermap.user where pnumber = " + "'" + userInfo.pnumber + "';"
    return pros(sql);
}

const updateUserPw = function (userInfo) {
    const sql = "update enablermap.user set pwd = " + "'" + userInfo.new + "'" + "where pnumber =" + "'" + userInfo.pnumber + "';"
    return pros(sql);
}

const checker = function (mail) {
    const sql = "select pnumber,pwd from enablermap.user where mail =" + "'" + mail + "';"
    return pros(sql);
}

const checkerpnumber = function (pnumber) {
    const sql = "select * from enablermap.company where pnumber =" + "'" + pnumber + "';"
    return pros(sql);
}

const getuserlist = function () {
    const sql = "select * from enablermap.company;"
    return pros(sql);
}

const getcompanydetail = function (companyNo) {
    const sql = "SELECT pcountry,poffice,pdep FROM enablermap.companydetail where pcompanycode=" + "'" + companyNo + "';"
    return pros(sql);
}

const getindoordetail = function (companyNo) {
    const sql = "SELECT * FROM enablermap.indoormap where pcompanycode=" + "'" + companyNo + "';"
    return pros(sql);
}

const updatakeypoints = function (svgfile, keypoints) {
    const sql = "UPDATE enablermap.indoormap SET keypoint=" + "'" + keypoints + "'" + "where svgfile = " + "'" + svgfile + "';"
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
    checker,
    checkerpnumber,
    getuserlist,
    getcompanydetail,
    confrimPw,
    getindoordetail,
    updatakeypoints
}
