mapconfig = new mapconfig();
const companycode = $.cookie('enabermap.uid').substring(0, 5);
var indoordetail;

$.ajax({
    type: 'GET',
    url: mapconfig.getindoordetail() + companycode,
    async: false,
    success: function (data) {
        indoordetail = data;
    },
    error: function (err) {
        console.log(err);
    }
})

var imgData = []
for (let i = 0; i < indoordetail.length; i++) {
    var tempimgurl=mapconfig.geturl()+indoordetail[i].svgfile;
    imgData.push(tempimgurl);
}


var list = document.querySelector('.list')
var ulEle = list.querySelector('ul')

function getUserName() {
    for (var i = 0; i < imgData.length; i++) {
        var liEle = document.createElement('li')
        var imgBox = document.createElement('div')
        var imgEle = document.createElement('img')
        var btnBox = document.createElement('div')
        var editBtn = document.createElement('button')
        var deleteBtn = document.createElement('button')
        // textEle.innerText = pnamelist[i]
        imgBox.classList.add('img-box')
        btnBox.classList.add('btn-box')
        editBtn.classList.add('btn', 'btn-primary')
        deleteBtn.classList.add('btn', 'btn-danger')
        editBtn.innerText = '編集'
        deleteBtn.innerText = '削除'
        imgEle.src = imgData[i]
        imgBox.appendChild(imgEle)
        imgBox.appendChild(btnBox)
        btnBox.appendChild(editBtn)
        btnBox.appendChild(deleteBtn)
        liEle.appendChild(imgBox)
        ulEle.appendChild(liEle)
    }
}

getUserName()
