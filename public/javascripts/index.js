//Java　Hashmap 自分を定義する
function HashMap() {
  this.map = {};
}

HashMap.prototype = {
  put: function (key, value) {
      this.map[key] = value;
  },
  get: function (key) {
      if (this.map.hasOwnProperty(key)) {
          return this.map[key];
      }
      return null;
  },
  remove: function (key) {
      if (this.map.hasOwnProperty(key)) {
          return delete this.map[key];
      }
      return false;
  },
  values: function () {
      var _values = new Array();
      for (var key in this.map) {
          _values.push(this.map[key]);
      }
      return _values;
  },
  removeAll: function () {
      this.map = {};
  },
  keySet: function () {
      var _keys = [];
      for (var i in this.map) {
          _keys.push(i);
      }
      return _keys;
  }
};
HashMap.prototype.constructor = HashMap;


let map;
let target_list = new HashMap();
let listData = [];
let userlist = [];


let checkedList = []
function domClick(e){
    let subItem = e.parentNode.nextElementSibling
    let inputList = subItem.querySelectorAll('.to__item')
    for(let i = 0; i < inputList.length; i++){
        let item = inputList[i]
        item.querySelector("input").checked = !e.querySelector("input").checked
        let subName = item.querySelector(".to__name").innerHTML
    }
    e.querySelector('input').checked = !e.querySelector("input").checked
}
function select(e){
    e.stopPropagation()
}
function cancel(){
    let cList = document.getElementsByName("cName")
    for (let i = 0; i < cList.length; i++) {
        let item = cList[i];
        if(item.value == dom.previousElementSibling.innerHTML){
            item.checked = false
            select();
            break;
        }
    }
}

function dropClick(dom){
    if(dom.className.indexOf("to__roate") > -1){
        dom.className = ""
    }else{
        dom.className = "to__roate"
    }
    let domShow = dom.parentNode.parentNode.nextElementSibling
    if(domShow.className.indexOf("to__show") > -1){
        domShow.className = "to__subItem"
    }
    else{
        domShow.className = "to__subItem to__show"
    }
}

let endHtml = 0
let html = ""
let level = 1
let userListTitle = document.getElementById('user-title')
userListTitle.innerHTML = listData.title
let domEle = [
    {
        classEle: 'dom-mobile-record',
        pEle: '行動履歴表示',
        imgEle: '/icon/map.png',
        aHref: '#'
    },
    {
        pEle: 'ユーザー設定',
        imgEle: '/icon/user.png',
        aHref: './userSettings.html'
    }
]

//Traverse the tree structure
function displayCompanyInfo(data, target){
    if(Object.prototype.toString.call(data) === '[object Array]' || Object.prototype.toString.call(data) === '[object Object]'){
        var basedom = document.createElement('div')
        if(Object.prototype.toString.call(data) === '[object Object]') {
            arrData = []
            for(let key in data) {
                arrData.push({
                    name: key,
                    children: data[key]
                })
            }
            data = arrData
        }
        console.log(data)
        for(let i = 0; i < data.length; i++){
            // Add title
            let setColor = document.createElement("div")
            let setBtn = document.createElement("div")
            let item = document.createElement("div")

            let domDiv = document.createElement('div')
            let domUl = document.createElement('ul')

            setBtn.innerHTML = "<img src='/icon/muen-btn.png'>"

            setBtn.classList.add('user-btn')
            setColor.classList.add('user-color')
            item.classList.add('item-box')

            domDiv.classList.add('dom-list')
            domDiv.style.display = 'none'
            domUl.classList.add('list-group','list-group-flush')
            // domImg.src = './icons/file.png'

            let arrow = '<span class="to__dropdownList" >' +
            '<i onclick="dropClick(this)">' +
            '<svg t="1550632829702" class="icon-svg" style="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1783" xmlns:xlink="http://www.w3.org/1999/xlink" width="100%" height="100%"><defs><style type="text/css"></style></defs><path d="M959.52557 254.29773 511.674589 702.334953 63.824631 254.29773Z" p-id="1784"></path></svg>' +
            '</i>' +
            '</span>'

            if(!data[i].hasOwnProperty('children')){ arrow = "" }

            htmlCnt = ''
            htmlCnt += '<div class="to__item level-' + level + '">'
            htmlCnt +=  arrow
            htmlCnt +=  '<span onclick="domClick(this)"><input type="checkbox" name="cName" onclick="return false;" /><div class="to__name">' +
                        data[i].name +
                        '</div></span>'
            htmlCnt +=  '</div>'
            item.innerHTML = htmlCnt
            //Add child elements
            let subItem = document.createElement("div")
            subItem.className = "to__subItem"
            item.appendChild(subItem)
            // Determine whether there are color attributes
            if(data[i].hasOwnProperty('color')) {
                for(let n = 0; n < domEle.length; n++){
                    let liEle = document.createElement('li')
                    let imgEle = document.createElement('img')
                    let aEle = document.createElement('a')
                    let pEle = document.createElement('p')
                    imgEle.src = domEle[n].imgEle
                    pEle.innerText = domEle[n].pEle
                    aEle.href = domEle[n].aHref
                    aEle.classList.add(domEle[n].classEle)

                    aEle.appendChild(imgEle)
                    aEle.appendChild(pEle)
                    liEle.appendChild(aEle)
                    domUl.appendChild(liEle)
                    domDiv.appendChild(domUl)
                    item.appendChild(domDiv)
                }

                item.appendChild(setColor)
                item.appendChild(setBtn)

                setColor.style.backgroundColor = data[i].color
            }
            basedom.appendChild(item)

            if(data[i].hasOwnProperty('children') && Object.keys(data[i].children).length > 0){
                level++
                displayCompanyInfo(data[i].children, subItem)
            }else{
                if(i == data.length - 1){
                    level--
                }
            }
        }
        target.innerHTML = basedom.innerHTML
        console.log(target)
    }
}
var leftCont = document.getElementById("leftCont")
// displayCompanyInfo(listData.tree, leftCont)

let selectUid = null;
let fpersontimer = null;
let refreshImg = document.getElementById('refresh-img');
let viewauto = true;
let IndoorMap = new HashMap();
let place_list = new HashMap();
let markerCluster = null;

//IndoorMap情報取得(api?)
let getIndoorInfo = function () {
    let testpaths = [
        { lat: 35.661517, lng: 139.745036 },
        { lat: 35.661343, lng: 139.745492 },
        { lat: 35.661142, lng: 139.745369 },
        { lat: 35.661312, lng: 139.744908 },
    ];
    IndoorMap.put('testplace', testpaths);
    let testpaths2 = [
        { lat: 36.661517, lng: 138.745036 },
        { lat: 36.661343, lng: 138.745492 },
        { lat: 36.661142, lng: 138.745369 },
        { lat: 36.661312, lng: 138.744908 },
    ];
    IndoorMap.put('testplace2', testpaths2);
};

//ユーザfocus機能コントロール
// let viewController = function () {
//     let btn = document.getElementById("viewControl");
//     if (viewauto) {
//         viewauto = false;
//         btn.innerText = "Start Auto View";
//     } else {
//         viewauto = true;
//         btn.innerText = "Stop Auto View";
//     }
//
// }

//画面初期化
var runMaps = function () {
    getIndoorInfo();
    const Tokyo = {lat: 35.68, lng: 139.75};
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 10,
        center: Tokyo,
        //projection: 'EPSG:4326',
    });
    drawplace(IndoorMap);

    /**
    * Tag clustering
    * maker---Liu Mingnian
    **/
    const locations = [
        { lat: 35.684489, lng: 139.753646 },
        { lat: 35.684768, lng: 139.703178 },
        { lat: 35.697316, lng: 139.826774 },
        { lat: 35.654367, lng: 139.788322 },
    ]
    const markers = locations.map((location,i) => {
        return new google.maps.Marker({
            position: location,
            label: userlist[i % userlist.length],
        })
    })
    markerCluster = new MarkerClusterer(map, markers,{
        imagePath: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
    })

    //自定义png，需要设置图片原始大小，然后定位一个锚点anchor
    const icon = {
        url: "http://localhost:3000/icon/door.png",
        size: new google.maps.Size(24, 24),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(12, 12),
    }
    const features = [
        {
            position: new google.maps.LatLng(35.661330, 139.745224),
            type: "info",
        }
    ]
    const shape = {
        coords: [1, 1, 1, 20, 18, 20, 18, 1],
        type: "poly",
      };
    for(let i = 0; i < features.length; i++){
        const marker = new google.maps.Marker({
            position: features[i].position,
            icon: icon,
            shape: shape,
            map: map
        })
        setPClickEvent(marker)
    }
};

/**
* googoleMap エリア
* maker---Liu Mingnian
**/
let drawplace = function (IndoorMap) {
    for (let i = 0; i < IndoorMap.values().length; i++) {
        let placemark = new google.maps.Marker({
            position: IndoorMap.values()[i][0],
            map: map,
        });
        setMClickEvent(placemark,IndoorMap.values()[i][0]);

        let temp = new google.maps.Polygon({
            paths: IndoorMap.values()[i],
            // strokeColor: '',
            strokeOpacity: 0.5,
            strokeWeight: 1,
            // fillColor: '',
            fillOpacity: 0.35,
        });
        temp.setMap(map);
        // setPClickEvent(temp,IndoorMap.keySet()[i]);
        place_list.put(IndoorMap.keySet()[i],temp);
    }
};

let setMClickEvent = function(marker,position){
    google.maps.event.addListener(marker, 'click', function (event) {
        map.setZoom(20);
        map.setCenter(position);
    });
};

//点击切换地图图层
let setPClickEvent = function(polygon,placename){
    google.maps.event.addListener(polygon, 'click', function (event) {
        // alert(placename);
        document.getElementById("map").style.display ="none";
        document.getElementById("IndoorMap").style.display ="block";
        ClearAll();
        imageMap()
    });
};

//draw one person position
let drawMark = function (uid, lat, lng) {
    if (target_list.get(uid) != null) {
        var temp = target_list.get(uid);
        temp[0].setMap(null);
        temp[0] = null;
        var marker = new google.maps.Marker({
            position: {lat: lat, lng: lng},
            label: uid,
            map: map,
        });
        temp[0] = marker;
        target_list.put(uid, temp);

    } else {
        var temp = [];
        var marker = new google.maps.Marker({
            position: {lat: lat, lng: lng},
            label: uid,
            map: map,
        });
        temp.push(marker);
        target_list.put(uid, temp);

    }
};

/*
*　userデータをもらう
*　maker---Liu Mingnian
*/
function showAll() {
  //性能が落ちる為、showAll時は場所一回表示する。
  // var showallflag = setInterval(showAll,5000);
  // console.log('test');
  //request userlist by ajax
  var indexcount = 0;
  for (var i in userlist) {
      if (indexcount < userlist.length) {
          $.ajax({
              timeout: 3000,
              type: 'GET',
              url: 'http://localhost:3000/users/' + userlist[i],
              async: false,
              success: function (data) {
                  if (data != null) {
                      drawMark(userlist[i], Number(data.lat), Number(data.lon));
                      indexcount++;
                  }
              },
              error: function (err) {
                  console.log(err);
              }
          })
      }
  }
}
// showAll()

// var ClearAll = function () {
//   clearInterval(fpersontimer);
//   for (var i in userlist) {
//       temp = target_list.get(userlist[i]);
//       if (temp != null) {
//           temp[0].setMap(null);
//       }
//   }
//   ;
//   target_list.removeAll();
// };

var followoneperson = function (uid) {
  if (selectUid != uid) {
      clearInterval(fpersontimer);
      selectUid = uid;
      fpersontimer = setInterval(fperson, 3000);
  }
}

//follow one person
var fperson = function () {
  var uid = selectUid;
  $.ajax({
      timeout: 3000,
      type: 'GET',
      url: 'http://localhost:3000/users/' + uid,
      success: function (data) {
          if (data != null) {
            //   console.log('3s test');
              drawMark(uid, Number(data.lat), Number(data.lon));
              if (viewauto) {
                  map.setCenter({lat: Number(data.lat), lng: Number(data.lon)});
                  map.setZoom(19);
              }
          }
      },
      error: function (err) {
          console.log(err);
      }
  })

};

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
    ecording.addEventListener('click',()=>{
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
    mobileRecordBtn.addEventListener('click',()=>{
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

// icon-colorの切り替え
function iconSwitch(){
  let aClass = document.querySelectorAll('.nav-link')
  for(let i = 0; i < aClass.length; i++){
      aClass[i].index = i
      aClass[i].addEventListener('click', function () {
          for(let n = 0; n < aClass.length; n++){
              const pathEle = aClass[n].getElementsByTagName('path')[0]
              pathEle.setAttribute('fill', '#007bff')
          }
          const pathEle = aClass[this.index].getElementsByTagName('path')[0]
          pathEle.setAttribute('fill', '#fff')
      })
  }
}
iconSwitch()

/**
 * メニューディスプレイの切り替え
 * maker---Liu Mingnian
*/
let menuChangePwd = document.getElementById('pwss')
let panelChangePwdCloseBtn = document.getElementById('pw-chagen-btn')
let panelChangePwd = document.getElementById('pw-chagen')
// let menuTime = document.getElementById('time')
let panelTimeRefresh = document.getElementById('time-refresh')
let PanelTimeCloseBtn = document.getElementById('time-btn')

function elementToggle(ele) {
  if(ele.style.display == 'none'){
      ele.style.display = 'block'
  }else{
      ele.style.display = 'none'
  }
}

menuChangePwd.onclick = function passChangeDemo(){
  elementToggle(panelChangePwd)
}
panelChangePwdCloseBtn.onclick = function passChangeDemo(){
  elementToggle(panelChangePwd)
}
// menuTime.onclick = function passChangeDemo(){
//   elementToggle(panelTimeRefresh)
// }


/**
 * 年月日のタイム選択
 * まだ決めっていないです
 * maker---Liu Mingnian
 */
let selector = document.querySelectorAll('.selector')
let option = document.getElementById('option')
let wrappers = document.querySelectorAll('.wrapper')
let startBtn = document.getElementById('start-btn')

var activeSelectorIndex = 0
for(let i = 0; i < selector.length; i++){
    selector[i].index = i
    selector[i].addEventListener('click',function(){
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

var generatorOptions = function(wrapper, groupIndex, max, min, sort = true, suffix = '') {
    for(let textNumber = min; textNumber <= max; textNumber++) {
        var option = document.createElement('div')
        var text = document.createTextNode(textNumber + suffix)
        option.val = textNumber
        option.groupIndex = groupIndex
        option.appendChild(text)
        // asc 升序
        if(wrapper.childNodes[0] && !sort){
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

/**
 * 右側list mod
 * maker---Liu Mingnian
*/
function userBtn(){
    let userBtn = document.querySelectorAll('.user-btn')
    for(let i = 0; i < userBtn.length; i++){
        userBtn[i].index = i
        userBtn[i].onclick = function changeDemo(){
            // 除当前点击对象以外全部关掉
            for(let n = 0; n < userBtn.length; n++) {
                const pathEle = userBtn[n].parentNode.querySelector('.dom-list')
                if (n !== this.index) pathEle.style.display = 'none'
            }
            const pathEle = userBtn[this.index].parentNode.querySelector('.dom-list')
            if(pathEle.style.display == 'none'){
                pathEle.style.display = 'block'
            }else{
                pathEle.style.display = 'none'
            }
        }
    }

    let domMobileRecord = document.querySelectorAll('.dom-mobile-record')
    for(let i = 0; i < domMobileRecord.length; i++){
        domMobileRecord[i].addEventListener('click', () => {
            if(mobileRecord.style.display == 'none'){
                mobileRecord.style.display = 'block'
            }else{
                mobileRecord.style.display = 'none'
            }
        })
    }
}



/**
 * パスワード変更
 * pwMatch()元パスワードをチェックする
 * newPw()変更したパスワードをアップデートする
 * maker---Liu Mingnian
 */
// function pwMatch(){
//     $.ajax({
//         type: 'get',
//         url: 'http://104.198.245.131:3000/password',
//         dataType: 'json',
//         async: true,
//         cache: false,
//         success: function(){
//             console.log(data)
//         },
//         error: function(){
//             alert('密码不能为空')
//         }
//     })
// }
function newPw(){
    if($("#current-pw").val() == "" || $("#new-pw").val() == "" || $("#confirm-new-pw").val() == ""){
        alert("情報を全部入力してください。");
    }else if($("#new-pw").val() != $("#confirm-new-pw").val()){
        alert('パスワードを確認してください')
    }else{
        $.ajax({
            type: 'post',
            url: 'http://localhost:3000/changepw',
            contentType: "application/json",
            dataType: "text",
            async: true,
            data: JSON.stringify({"data": {"newPw": $("##new-pw").val(),"confirmNewPw": $("#confirm-new-pw").val()}}),
            success: function () {
                // window.location.href = 'index.html';
                console.log('成功')
            },
            error: function () {
                alert("User is not found");
            }
        })
    }
}

/*
*　実際のデータリクエストポート
*　@Author Liu Mingnian
*/
function listMake() {
    let uls = document.querySelector('#leftCont')
    console.log(uls)
    // 返回公司暂定只有同一个
    $.ajax({
        timeout: 3000,
        type: 'GET',
        url: 'http://104.198.245.131:3000/getuserlist',
        success: function (data) {
            var resData = data;
            console.log(resData)
            var listData = {}
            listData.tree = {}
            resData.forEach(function(user, index){
                var userCountry = user.pcountry
                var userOffice = user.poffice
                var userDep = user.pdep
                var userNumber = user.pnumber

                if(index === 0) listData.title = user.pcompanycode
                if(!listData.tree.hasOwnProperty(userOffice)) listData.tree[userOffice] = {}
                if(!listData.tree[userOffice].hasOwnProperty(userDep)) listData.tree[userOffice][userDep] = []

                listData.tree[userOffice][userDep].push({
                    name: userNumber,
                    color: `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`
                })
            })
            console.log(listData.tree)
            userListTitle.innerHTML = listData.title
            displayCompanyInfo(listData.tree, uls)
            userBtn()
        },
        error: function (err) {
            console.log(err);
        }
    })
}
listMake()
