class LoginUser{
    constructor(companyNo,country,officeNo,departmentno,personno,mailAddress,password,role,displayicon,displaycolor) {
        this.companyNo=companyNo;
        this.country=country;
        this.officeNo=officeNo;
        this.departmentno=departmentno;
        this.personno=personno;
        this.mailAddress=mailAddress;
        this.password=password;
        this.role=role;
        this.displayicon=displayicon;
        this.displaycolor=displaycolor;
    }

    getUid(){
        return this.companyNo+this.country+this.officeNo+this.departmentno+this.personno;
    }

}
