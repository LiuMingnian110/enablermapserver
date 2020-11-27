const client = require('./MySQLUtil');

const queryUserByUid = function (pnumber) {
    const sql = "select * from enablermap.user where pnumber = " + "'" + pnumber + "'" + ";";
    return pros(sql);
}

const insertUser = function (mail, pwd, prole, displayicon, displaycolor, pnumber, pname) {
    const sql = "insert ignore into enablermap.user values (" + "'" + mail + "'," + "'" + pwd + "'," + "'" + prole + "'," + "'" + displayicon + "'," + "'" + displaycolor + "'," + "'" + pnumber + "'," + "'" + pname + "');"
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

const checker = function (mail, pwd) {
    const sql = "select pnumber from enablermap.user where mail =" + "'" + mail + "' and pwd = " + "'" + pwd + "';"
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

const getcompanyname = function (companyNo) {
    const sql = "SELECT companyname FROM enablermap.companyall where companycode=" + "'" + companyNo + "';"
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

const uploadtime = function (companycode, uploadtime) {
    const sql = "UPDATE enablermap.uploadtime SET uploadtime=" + "'" + uploadtime + "'" + "where companycode = " + "'" + companycode + "';"
    return pros(sql);
}

const newpnumber = function (companycode, contrycode, officecode, pdep) {
    const sql = "INSERT INTO enablermap.company (pcompanycode, pcountry, poffice, pdep) VALUES (" + "'" + companycode + "', '" + contrycode + "', '" + officecode + "', '" + pdep + "');"
    return pros(sql);
}

const getlastpnumber = function () {
    const sql = "select max(pnumber) as maxpnumber from enablermap.company;"
    return pros(sql);
}

const insertIndoorMap = function (pcompanycode,pcountry,svgfile,building,floor,position) {
    const sql = "insert ignore into enablermap.indoormap values ("+"'"+pcompanycode+"','"+pcountry+"','"+svgfile+"','"+building+"','"+floor+"','"+position+"',null);"
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
    updatakeypoints,
    getcompanyname,
    uploadtime,
    newpnumber,
    getlastpnumber,
    insertIndoorMap
}
