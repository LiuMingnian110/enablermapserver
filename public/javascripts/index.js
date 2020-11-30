let map;
let indoormap;
let markerCluster = null;
const cookie_value = $.cookie("enabermap.uid");
const companycode = cookie_value.substring(0, 5);
let uidlist = [];
let pnumberlist = [];
//console for dev test
let test;


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
    document.getElementById("map").style.display = "none";
    document.getElementById("IndoorMap").style.display = "block";
    drawcurrentindoormap(filename, keypoint);
}

var drawcurrentindoormap = function (filename, keypoint) {
    var keypoints = keypoint.split(",");
    //quit
    L.Control.quitpage = L.Control.extend({

        quitmain: function () {
            document.getElementById("map").style.display = "block";
            document.getElementById("IndoorMap").style.display = "none";
            test.remove();
            test1.remove();
            test2.remove();
        },

        onAdd: function (map) {
            var img = L.DomUtil.create('img');
            img.src = '/icon/shut.png';
            img.style.width = '50px'
            L.DomEvent.addListener(img, 'click', this.quitmain, this);
            return img;
        },

    });
    L.control.quitpage = function (opts) {
        return new L.Control.quitpage(opts);
    }

    var test1 = L.control.quitpage({position: 'topright'}).addTo(indoormap);

    //showmessage
    L.Control.showbox = L.Control.extend({

        onAdd: function (map) {
            var divbox = L.DomUtil.create('div');
            divbox.id = "info";
            return divbox;
        },

    });
    L.control.showbox = function (opts) {
        return new L.Control.showbox(opts);
    }

    var test2 = L.control.showbox({position: 'bottomleft'}).addTo(indoormap);

    indoormap.on('mousemove', function (e) {
        document.getElementById('info').innerHTML = JSON.stringify(e.latlng);
    });

    var imageUrl = 'http://localhost/' + filename,
        imageBounds = [
            [Number(keypoints[0]), Number(keypoints[1])],
            [Number(keypoints[2]), Number(keypoints[3])]
        ];
    test = L.imageOverlay(imageUrl, imageBounds).addTo(indoormap);
    indoormap.fitBounds(imageBounds);
    indoormap.setZoom(22);

}

var drawPosition = function () {
    $.ajax({
        type: 'GET',
        async: false,
        url: 'http://localhost:3000/getuserlist/' + companycode,
        success: function (data) {
            if (data != null) {
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

    timedraw(showallposition,1000);

    console.log(pnumberlist);
    console.log(uidlist);

}

var showallposition = function () {
    var locations = [];
    if (markerCluster != null) {
        markerCluster.clearMarkers();
    }
    for (let i = 0; i < 2; i++) {
        if (i == 0) {
            $.ajax({
                type: 'GET',
                async: false,
                url: 'http://104.198.245.131/getlocation/9999908100100100016',
                success: function (data) {
                    var latlng = {lat: Number(data.lat), lng: Number(data.lon)};
                    locations.push(latlng);
                },
                error: function (err) {
                    console.log(err);
                }
            })
        }
        ;
        if (i == 1) {
            $.ajax({
                type: 'GET',
                async: false,
                url: 'http://104.198.245.131/getlocation/9999908100100100017',
                success: function (data) {
                    var latlng = {lat: Number(data.lat), lng: Number(data.lon)};
                    locations.push(latlng);
                },
                error: function (err) {
                    console.log(err);
                }
            })
        }
    }
    // for(let i=0;i<uidlist.length;i++){
    //     $.ajax({
    //         type: 'GET',
    //         async: false,
    //         url: 'http://localhost:3000/getlocation/' + uidlist[i],
    //         success: function (data) {
    //             var latlng = {lat: Number(data.lat), lng: Number(data.lon)};
    //             locations.push(latlng);
    //         },
    //         error: function (err) {
    //             console.log(err);
    //         }
    //     })
    // }

    var markers = locations.map((location, i) => {
        return new google.maps.Marker({
            position: location,
            // label: userlist[i % userlist.length],
        })
    })

    markerCluster = new MarkerClusterer(map, markers, {
        imagePath: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
    })

}

var timedraw = function(fn, millisec) {
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

    indoormap = L.map('IndoorMap', {
        center: [40.75, -74.2],
        zoom: 10
    });

    getmapdetail(companycode);

    drawPosition();
}

init();

// /**
//  * Tag clustering
//  * maker---Liu Mingnian
//  **/
// const locations = [
//     {lat: 35.684489, lng: 139.753646},
//     {lat: 35.684768, lng: 139.703178},
//     {lat: 35.697316, lng: 139.826774},
//     {lat: 35.654367, lng: 139.788322},
// ]
// const markers = locations.map((location, i) => {
//     return new google.maps.Marker({
//         position: location,
//         label: userlist[i % userlist.length],
//     })
// })
// markerCluster = new MarkerClusterer(map, markers, {
//     imagePath: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
// })
//
// //自定义png，需要设置图片原始大小，然后定位一个锚点anchor
// const icon = {
//     url: "http://localhost:3000/icon/door.png",
//     size: new google.maps.Size(24, 24),
//     origin: new google.maps.Point(0, 0),
//     anchor: new google.maps.Point(12, 12),
// }
// const features = [
//     {
//         position: new google.maps.LatLng(35.661330, 139.745224),
//         type: "info",
//     }
// ]
// const shape = {
//     coords: [1, 1, 1, 20, 18, 20, 18, 1],
//     type: "poly",
// };
// for (let i = 0; i < features.length; i++) {
//     const marker = new google.maps.Marker({
//         position: features[i].position,
//         icon: icon,
//         shape: shape,
//         map: map
//     })


// /**
//  * googoleMap エリア
//  * maker---Liu Mingnian
//  **/
// let drawplace = function (IndoorMap) {
//     for (let i = 0; i < IndoorMap.values().length; i++) {
//         let placemark = new google.maps.Marker({
//             position: IndoorMap.values()[i][0],
//             map: map,
//         });
//         setMClickEvent(placemark, IndoorMap.values()[i][0]);
//
//         let temp = new google.maps.Polygon({
//             paths: IndoorMap.values()[i],
//             // strokeColor: '',
//             strokeOpacity: 0.5,
//             strokeWeight: 1,
//             // fillColor: '',
//             fillOpacity: 0.35,
//         });
//         temp.setMap(map);
//         // setPClickEvent(temp,IndoorMap.keySet()[i]);
//         place_list.put(IndoorMap.keySet()[i], temp);
//     }
// };

// let setMClickEvent = function (marker, position) {
//     google.maps.event.addListener(marker, 'click', function (event) {
//         map.setZoom(20);
//         map.setCenter(position);
//     });
// };


//draw one person position
// let drawMark = function (uid, lat, lng) {
//     if (target_list.get(uid) != null) {
//         var temp = target_list.get(uid);
//         temp[0].setMap(null);
//         temp[0] = null;
//         var marker = new google.maps.Marker({
//             position: {lat: lat, lng: lng},
//             label: uid,
//             map: map,
//         });
//         temp[0] = marker;
//         target_list.put(uid, temp);
//
//     } else {
//         var temp = [];
//         var marker = new google.maps.Marker({
//             position: {lat: lat, lng: lng},
//             label: uid,
//             map: map,
//         });
//         temp.push(marker);
//         target_list.put(uid, temp);
//
//     }
// };
//
//
// //follow one person
// var fperson = function () {
//     var uid = selectUid;
//     $.ajax({
//         timeout: 3000,
//         type: 'GET',
//         url: 'http://localhost:3000/users/' + uid,
//         success: function (data) {
//             if (data != null) {
//                 //   console.log('3s test');
//                 drawMark(uid, Number(data.lat), Number(data.lon));
//                 if (viewauto) {
//                     map.setCenter({lat: Number(data.lat), lng: Number(data.lon)});
//                     map.setZoom(19);
//                 }
//             }
//         },
//         error: function (err) {
//             console.log(err);
//         }
//     })
//
// };

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
generatorOptions(wrappers[0], 0, date.getFullYear(), date.getFullYear() - yearPageSize, false, '年')
generatorOptions(wrappers[1], 1, 12, 1, true, '月')
generatorOptions(wrappers[2], 2, 31, 1, true, '日')
generatorOptions(wrappers[3], 3, 24, 1, true, '時')
generatorOptions(wrappers[4], 4, 59, 1, true, '分')
generatorOptions(wrappers[5], 5, 23, 1, true, '時間前')
generatorOptions(wrappers[6], 6, 10, 1, true, 'x')



