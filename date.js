module.exports.getDate=getDate;
function getDate(){
    var d=new Date();
    var options={
        weekday:"long",
        day:"numeric",
        month:"long"
    };
    var day=d.toLocaleDateString("en-US",options);
    return day;
}
module.exports.getDay=getDay;
function getDay(){
    var d=new Date();
    var options={
        weekday:"long",
    };
    var day=d.toLocaleDateString("en-US",options);
    return day;
}
