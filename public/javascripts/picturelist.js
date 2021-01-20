mapconfig = new mapconfig();
const companyCode = $.cookie('enabermap.uid').substring(0, 5);
//get building floor  svgFile
var getBuilding = function () {
    $.ajax({
        type: 'GET',
        url: mapconfig.getindoordetail() + companyCode,
        async: false,
        success: function (data) {
            console.log(data)
            for (var i = 0; i < data.length; i++) {
                var table = document.querySelector('table')
                var tr = document.createElement('tr')
                var tdNum = document.createElement('td')
                var tdBtn = document.createElement('td')
                var tdJp = document.createElement('td')
                var tdEn = document.createElement('td')
                var tdF = document.createElement('td')
                var tdImg = document.createElement('td')
                var tdNote = document.createElement('td')

                var a = document.createElement('a')
                var img = document.createElement('img')

                tr.classList.add('text')
                img.classList.add('floor-plan')
                tdNote.classList.add('not-text')
                a.classList.add('tdBtn')
                tdJp.classList.add('name-jp')
                tdEn.classList.add('name-en')
                tdF.classList.add('floor')
                a.href = '#'
                //href = indoorMap.html
                img.src = mapconfig.geturl()+data[i].svgfile
                tdNum.innerText = i + 1
                a.innerText = '編集'
                tdJp.innerText = data[i].building
                tdEn.innerText = data[i].buildingeng
                tdF.innerText = data[i].floor
                tdNote.innerText = data[i].note

                table.appendChild(tr)
                tr.appendChild(tdNum)
                tr.appendChild(tdBtn)
                tr.appendChild(tdJp)
                tr.appendChild(tdEn)
                tr.appendChild(tdF)
                tr.appendChild(tdImg)
                tr.appendChild(tdNote)
                tdBtn.appendChild(a)
                tdImg.appendChild(img)
            }
            edit()
        },
        error: function(err){
            console.log(err)
        }
    })
}
getBuilding()

function edit(){
    var tdBtn = document.querySelectorAll('.tdBtn')
    for(var i = 0; i < tdBtn.length; i++){
        tdBtn[i].index = i
        tdBtn[i].addEventListener('click',function(){
            var fatherNode =  tdBtn[this.index].parentNode.parentNode
            var url = fatherNode.children[5].childNodes[0].src.toString();
            var index = url.lastIndexOf("\/");
            var str = url.substring(index + 1,url.length);
            window.location.href = '/updatebuilding/'+str;

        })
    }
}
