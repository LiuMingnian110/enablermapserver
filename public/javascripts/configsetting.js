class mapconfig {
    constructor() {
        this.url = 'http://localhost/'
        this.baseurl = 'http://localhost:3000/'
    }

    geturl(){
        return this.url
    }


    getbaseurl() {
        return this.baseurl
    }

    //login html
    getcompanyname() {
        return this.baseurl + 'getcompanyname/'
    }

    loginbypwd() {
        return this.baseurl + 'loginbypd'
    }

    //admin-settings html
    uploadtime() {
        return this.baseurl + 'uploadtime'
    }

    //historyshow html
    getindoordetail() {
        return this.baseurl + 'getindoordetail/'
    }

    gethistorical() {
        return this.baseurl + 'historical/'
    }

    //indoor-map html
    svgupload(){
        return this.baseurl + 'singleUpload'
    }

    //indoorfloor html
    getfloordetail(){
        return this.baseurl + 'getfloordetail/'
    }

    //logic html
    updatakeypoint(){
        return this.baseurl + 'updatakeypoint'
    }

    //mapindoor html
    getlocations(){
        return this.baseurl + 'getlocations/'
    }

    //userSettings html
    getcodnamelist(){
        return this.baseurl + 'getcodnamelist'
    }

    getcompanydetail(){
        return this.baseurl + 'getcompanydetail/'
    }

    newuser(){
        return this.baseurl + 'newuser'
    }

    //index html
    user(){
        return this.baseurl + 'user/'
    }

    getuserlist(){
        return this.baseurl + 'getuserlist/'
    }

    changepw(){
        return this.baseurl + 'changepw'
    }


}
