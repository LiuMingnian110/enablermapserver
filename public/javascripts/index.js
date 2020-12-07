let map;
let markerCluster = null;
const companycode = $.cookie("enabermap.uid").substring(0, 5);
const adminpnumber = cookie_value.substring(14);
let UserListData = null;
let uidlist = [];
let pnumberlist = [];
let userdetaillist = [];
let pnamelist = [];

//屋内地図Map上に書く
var getmapdetail = function (companycode) {
    $.ajax({
        type: 'GET',
        url: 'http://localhost:3000/getindoordetail/' + companycode,
        success: function (data) {
            indoordetail = data;
            for (let i = 0, len = indoordetail.length; i < len; i++) {
                var templist = indoordetail[i].position.split("|");
                var areaCoords = [];
                for (let j = 0, len = templist.length; j < len; j++) {
                    var tempstring = {
                        lat: Number(templist[j].split(",")[0]),
                        lng: Number(templist[j].split(",")[1])
                    }
                    areaCoords.push(tempstring);
                }
                var areaTriangle = new google.maps.Polygon({
                    paths: areaCoords,
                    strokeColor: "#FF0000",
                    strokeOpacity: 0.8,
                    strokeWeight: 3,
                    fillColor: "#FF0000",
                    fillOpacity: 0.35,
                });
                areaTriangle.setMap(map);
                areaTriangle.addListener("click", function () {
                    showindoormap(indoordetail[i].svgfile, indoordetail[i].keypoint);
                });
            }
        },
        error: function (err) {
            console.log(err);
        }
    })
};

var showindoormap = function (filename, keypoint) {
    $.cookie('filename', filename);
    $.cookie('keypoints', keypoint);
    window.open("http://localhost:3000/mapindoor");
}

var getpersondetail = function () {
    for (let i = 0; i < pnumberlist.length; i++) {
        $.ajax({
            type: 'GET',
            async: false,
            url: 'http://localhost:3000/user/' + pnumberlist[i],
            success: function (data) {
                userdetaillist.push(data);
                pnamelist.push(data[0].pname);
            },
            error: function (err) {
                console.log(err);
            }
        })
    }

}

var companyNameEle = document.querySelector('#user-title');

var userlistmake = function () {
    companyNameEle.innerText = companycode;
    const treeitem = document.querySelector('.treeitem');
    const treeData = {};
    for (let i = 0; i < UserListData.length; i++) {
        const user = UserListData[i];
        var companyCode = user.pcompanycode;
        var country = user.pcountry;
        var office = user.poffice;
        var userDep = user.pdep;
        var userNumber = user.pnumber;

        if (!treeData.hasOwnProperty(office)) treeData[office] = {};
        if (!treeData[office].hasOwnProperty(userDep)) treeData[office][userDep] = [];

        //userName color
        var userName = userdetaillist[i][0].pname;
        var userColor = userdetaillist[i][0].displaycolor;
        treeData[office][userDep].push({
            name: userName,
            number: userNumber,
            office: office,
            dep: userDep,
            country: country,
            companyName: companyCode,
            color: `#${userColor}`
        })
    }
    createCompanyTree(treeitem, treeData);


}

var checkEvent = function () {
    var currentNode = this.parentNode
    var levelClass = currentNode.classList[1]
    var currentChecked = this.classList.contains('checkbox-active')
    var level = levelClass.split('-')[1]
    if (currentChecked) {
        this.classList.remove('checkbox-active')
    } else {
        this.classList.add('checkbox-active')
    }
    if (currentNode.nextSibling !== null) {
        var nextLevel = currentNode.nextSibling.classList[1].split('-')[1]
        var nextEle = currentNode
        while (nextLevel > level) {
            nextEle = nextEle.nextSibling
            var checkbox = nextEle.querySelector('.checkbox')
            if (currentChecked) {
                checkbox.classList.remove('checkbox-active')
            } else {
                checkbox.classList.add('checkbox-active')
            }
            if (nextEle.nextSibling === null) break
            nextLevel = nextEle.nextSibling.classList[1].split('-')[1]
        }
    }
}


var createCompanyTree = function (parent, treeData, level = 1) {
    const genDom = new GenDOM()
    for (let key in treeData) {
        treeData[key]
        var user = treeData[key]
        if (level === 3) {
            genDom.createTreeNode(parent, user.name, level, '', true, user.color,
                true, {}, {
                    handlerName: 'click',
                    bindData: user,
                    event: checkEvent
                })
        } else {
            genDom.createTreeNode(parent, key, level, svgIcons.trangle, true, user.color,
                false, {}, {
                    handlerName: 'click',
                    bindData: user,
                    event: checkEvent
                })
            createCompanyTree(parent, treeData[key], level + 1)
        }
    }
}

var drawPosition = function () {
    $.ajax({
        type: 'GET',
        async: false,
        url: 'http://localhost:3000/getuserlist/' + companycode,
        success: function (data) {
            if (data != null) {
                UserListData = data;
                for (let i = 0; i < data.length; i++) {
                    pnumberlist.push(data[i].pnumber);
                    var uid = data[i].pcompanycode + data[i].pcountry + data[i].poffice + data[i].pdep + data[i].pnumber;
                    uidlist.push(uid);
                }
            }
        },
        error: function (err) {
            console.log(err);
        }
    })

    getpersondetail();

    userlistmake();

    $.cookie('uidlist', uidlist.toString());
    $.cookie('pnamelist', pnamelist.toString());
    timedraw(showallposition, 3000);


}

var showallposition = function () {
    var tempnamelist = [];
    var locations = [];
    if (markerCluster != null) {
        markerCluster.clearMarkers();
    }

    for (let i = 0; i < uidlist.length; i++) {
        $.ajax({
            type: 'GET',
            async: false,
            url: 'http://localhost:3000/getlocation/' + uidlist[i],
            success: function (data) {
                if (data != null) {
                    tempnamelist.push(pnamelist[i]);
                    var latlng = {lat: Number(data.lat), lng: Number(data.lon)};
                    locations.push(latlng);
                }
            },
            error: function (err) {
                console.log(err);
            }
        })
    }

    var markers = locations.map((location, i) => {
        return new google.maps.Marker({
            position: location,
            label: tempnamelist[i % tempnamelist.length],
        })
    })

    markerCluster = new MarkerClusterer(map, markers, {
        imagePath: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
    })

}

var timedraw = function (fn, millisec) {
    function interval() {
        setTimeout(interval, millisec);
        fn();
    }

    setTimeout(interval, millisec)
}


//画面初期化
var init = function () {
    const Tokyo = {lat: 35.68, lng: 139.75};
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 10,
        center: Tokyo,
    });

    getmapdetail(companycode);

    drawPosition();
}

init();

/**
 * SwitchBtn
 * ボータンの切り替え
 *  maker---Liu Mingnian
 */
let mobileRecord = document.getElementById('mobile-record')
let mobileRecordBtn = document.getElementById('mobile-record-btn')

function btn() {
    let meunBtn = document.getElementById("meun-btn")
    let cancel = document.getElementById("cancel")
    let meun = document.getElementById('meun')
    let lists = document.getElementById("lists")
    let listBtn = document.getElementById("list-btn")
    let rightBtn = document.getElementById('right-btn')
    let ecording = document.getElementById('ecording')

    meunBtn.addEventListener('click', () => {
        if (meun.style.display == 'none') {
            meun.style.display = 'block'
            if (meun.style.display == 'block') {
                cancel.src = '/icon/hide-btn.png'
            }
        } else {
            meun.style.display = 'none'
            if (meun.style.display == 'none') {
                cancel.src = '/icon/right-btn.png'
            }
        }
    })
    ecording.addEventListener('click', () => {
        if (lists.style.display == 'none') {
            lists.style.display = 'block'
            mobileRecord.style.display = 'block'
            if (lists.style.display == 'block') {
                rightBtn.src = '/icon/hide-btn.png'
            }
        } else {
            mobileRecord.style.display = 'none'
            lists.style.display = 'none'
            if (lists.style.display == 'none') {
                rightBtn.src = '/icon/hide-btn.png'
            }
        }
    })
    mobileRecordBtn.addEventListener('click', () => {
        if (mobileRecord.style.display == 'none') {
            mobileRecord.style.display = 'block'
        } else {
            mobileRecord.style.display = 'none'
        }
    })
    listBtn.addEventListener('click', () => {
        if (lists.style.display == 'none') {
            lists.style.display = 'block'
            if (lists.style.display == 'block') {
                rightBtn.src = '/icon/hide-btn.png'
            }
        } else {
            lists.style.display = 'none'
            if (lists.style.display == 'none') {
                rightBtn.src = '/icon/left-btn.png'
            }
        }
    })
};
btn();

/**
 * メニューディスプレイの切り替え
 * maker---Liu Mingnian
 */
let menuChangePwd = document.getElementById('pwss')
let panelChangePwdCloseBtn = document.getElementById('pw-chagen-btn')
let panelChangePwd = document.getElementById('pw-chagen')

function elementToggle(ele) {
    if (ele.style.display == 'none') {
        ele.style.display = 'block'
    } else {
        ele.style.display = 'none'
    }
}

menuChangePwd.onclick = function passChangeDemo() {
    elementToggle(panelChangePwd)
}
panelChangePwdCloseBtn.onclick = function passChangeDemo() {
    elementToggle(panelChangePwd)
}


/**
 * 年月日のタイム選択
 * まだ決めっていないです
 * maker---Liu Mingnian
 */
let selector = document.querySelectorAll('.selector')
let option = document.getElementById('option')
let wrappers = document.querySelectorAll('.wrapper')

var activeSelectorIndex = 0
for (let i = 0; i < selector.length; i++) {
    selector[i].index = i
    selector[i].addEventListener('click', function () {
        activeSelectorIndex = this.index
        // selector[this.index].style.borderColor = '#007bff'
        var selectorPopover = selector[this.index].querySelector('.selector-popover')
        selectorPopover.style.display = selectorPopover.style.display == 'none' ? 'block' : 'none'
    })
}

const date = new Date()
const year = date.getFullYear()
const month = date.getMonth()
const day = date.getDate()
const hh = date.getHours()
const mm = date.getMinutes()

var generatorOptions = function (wrapper, groupIndex, max, min, sort = true, suffix = '') {
    for (let textNumber = min; textNumber <= max; textNumber++) {
        var option = document.createElement('div')
        var text = document.createTextNode(textNumber + suffix)
        option.val = textNumber
        option.groupIndex = groupIndex
        option.appendChild(text)
        // asc 升序
        if (wrapper.childNodes[0] && !sort) {
            wrapper.insertBefore(option, wrapper.childNodes[0]);
        } else {
            wrapper.appendChild(option)
        }
        option.onclick = function () {
            selector[this.groupIndex].getElementsByClassName('set-val')[0].innerText = this.val + suffix
        }
    }
}
// 0: Year
const yearPageSize = 20
generatorOptions(wrappers[0], 0, date.getFullYear(), date.getFullYear() - yearPageSize, false, '')
generatorOptions(wrappers[1], 1, 12, 1, true, '')
generatorOptions(wrappers[2], 2, 31, 1, true, '')
generatorOptions(wrappers[3], 3, 24, 1, true, '')
generatorOptions(wrappers[4], 4, 59, 1, true, '')
generatorOptions(wrappers[5], 5, 23, 1, true, '')
generatorOptions(wrappers[6], 6, 100, 1, true, '')


//パスワード変更機能
document.getElementById('submit-btn').addEventListener('click', function () {
    var currentpd = document.getElementById('current-pw').value;
    var newpd = document.getElementById('new-pw').value;
    var againpd = document.getElementById('confirm-new-pw').value;
    if (againpd != newpd) {
        alert("please enter the same password !");
    } else {
        $.ajax({
            type: 'POST',
            url: 'http://localhost:3000/changepw',
            contentType: "application/json",
            dataType: "text",
            data: JSON.stringify({
                "data": {
                    "pnumber": adminpnumber,
                    "pwd": currentpd,
                    "newpwd": newpd
                }
            }),
            success: function (data) {
                if (JSON.parse(data).status == 'success') {
                    alert("updata password success!");
                } else {
                    alert("updata password failed!");
                }
            },
            error: function () {
                alert('Please check your network,if it is still not work.Please look admin for help!');
            }
        })
    }
})

var stringpluszero = function (num) {
    if (num < 10) {
        return "0" + num.toString();
    } else {
        return num.toString();
    }

}

//履歴表示機能
document.getElementById('start-btn').addEventListener('click', function () {
    var year = document.getElementById('historyyear').innerText;
    var month = document.getElementById('historymonth').innerText;
    var day = document.getElementById('historyday').innerText;
    var hour = document.getElementById('historyhour').innerText;
    var min = document.getElementById('historymin').innerText;
    var longtime = document.getElementById('historytime').innerText;
    var speed = document.getElementById('historyspeed').innerText;

    var japantime = new Date();
    japantime.setFullYear(Number(year));
    japantime.setMonth(Number(month) - 1);
    japantime.setDate(Number(day));
    japantime.setHours(Number(hour));
    japantime.setMinutes(Number(min));
    var mintimets = japantime.getTime() - (3600000 * Number(longtime));
    var mintimetemp = new Date(mintimets);
    var target_time_min = mintimetemp.getUTCFullYear() + "-" + stringpluszero(Number(mintimetemp.getUTCMonth() + 1)) + "-" + stringpluszero(mintimetemp.getUTCDate()) + "T" + stringpluszero(mintimetemp.getUTCHours()) + ":" + stringpluszero(mintimetemp.getUTCMinutes()) + ":00.000Z";
    var target_time_max = japantime.getUTCFullYear() + "-" + stringpluszero(Number(japantime.getUTCMonth() + 1)) + "-" + stringpluszero(japantime.getUTCDate()) + "T" + stringpluszero(japantime.getUTCHours()) + ":" + stringpluszero(japantime.getUTCMinutes()) + ":00.000Z";

    var playspeed = Number(1000 / Number(speed));

    var levelNo = document.querySelectorAll('.level-3')
    var data = []
    var flag = false
    for (var i = 0; i < levelNo.length; i++) {
        var checkbox = levelNo[i].querySelector('.checkbox-active')
        if (checkbox) {
            var companyName = checkbox.bindData.companyName
            var country = checkbox.bindData.country
            var office = checkbox.bindData.office
            var dep = checkbox.bindData.dep
            var number = checkbox.bindData.number
            data.push(companyName + country + office + dep + number)
            flag = true
        }
    }
    if (!flag) {
        alert('choose at lest one person');
    }
    $.cookie('userlist', data.toString());
    $.cookie('target_time_min', target_time_min);
    $.cookie('target_time_max', target_time_max);
    $.cookie('speed', playspeed.toString());

    window.open("http://localhost:3000/historyshow");

})

