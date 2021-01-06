mapconfig = new mapconfig();

var companycode = $.cookie("enabermap.uid").toString().substring(0, 5);
var companydetail = null
var pnumberlist = []
var userdetaillist = []

$.ajax({
    type: 'GET',
    async: false,
    url: mapconfig.getuserlist() + companycode,
    success: function (data) {
        if (data != null) {
            companydetail = data;
            for (let i = 0; i < data.length; i++) {
                pnumberlist.push(data[i].pnumber);
            }
        }
    },
    error: function (err) {
        console.log(err);
    }
})

for (let i = 0; i < pnumberlist.length; i++) {
    $.ajax({
        type: 'GET',
        async: false,
        url: mapconfig.user() + pnumberlist[i],
        success: function (data) {
            userdetaillist.push(data);
        },
        error: function (err) {
            console.log(err);
        }
    })
}

const officedic = {};
const depdic = {};
$.ajax({
    type: 'GET',
    async: false,
    url: mapconfig.getcodnamelist(),
    success: function (data) {
        for (let i = 0; i < data[1].length; i++) {
            officedic[data[1][i].officecode] = data[1][i].officename;
        }

        for (let i = 0; i < data[2].length; i++) {
            depdic[data[2][i].depcode] = data[2][i].depname;
        }
    },
    error: function (err) {
        console.log(err);
    }
})

const rolename = {};
$.ajax({
    type: 'GET',
    async: false,
    url: mapconfig.getsysroledetail(),
    success: function (data) {
        for (let i = 0; i < data.length; i++) {
            rolename[data[i].roleid] = data[i].rolename;
        }
    },
    error: function (err) {
        console.log(err);
    }
})

for (let i = 0; i < userdetaillist.length; i++) {
    var temp = [];
    temp[0] = officedic[companydetail[i].poffice];
    temp[1] = depdic[companydetail[i].pdep];
    temp[3] = userdetaillist[i][0].pnumber;
    temp[4] = userdetaillist[i][0].pname;
    temp[5] = userdetaillist[i][0].mail;
    temp[6] = rolename[userdetaillist[i][0].prole];
    temp[7] = userdetaillist[i][0].displayicon;
    temp[8] = userdetaillist[i][0].note;
    var tr = `<td>${temp[0]}</td>
        <td>${temp[1]}</td>
        <td>
            <a href="./updatauserset/${temp[3]}">
                編集
            </a>
        </td>
        <td>${temp[3]}</td>
        <td>${temp[4]}</td>
        <td>${temp[5]}</td>
        <td>${temp[6]}</td>
        <td>${temp[7]}</td>
        <td>${temp[8]}</td>`

    $("#target").append('<tr>' + tr + '</tr>');
}

