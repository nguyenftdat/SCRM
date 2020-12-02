//@flow
export const formatDate = (date:Date) => {
    var day = date.getDate();
    if (day < 10)
        day = '0'+day;
    var month = date.getMonth()+1;
    month = month < 10 ? '0' + month : month;
    var year = date.getFullYear();

    return day+'/'+month+'/'+year;
}

export const formatDateTime = (date:Date) => {
    var day = date.getDate();
    if (day < 10)
        day = '0'+day;
    var month = date.getMonth()+1;
    month = month < 10 ? '0' + month : month;
    var year = date.getFullYear();
    var hour = date.getHours();
    hour = hour < 10 ? '0' + hour : hour;
    var minute = date.getMinutes();
    minute = minute < 10 ? '0' + minute : minute;

    return day+'/'+month+'/'+year+' '+hour+':'+minute;
}

export const getRegion = (lat, lon) => {
        let distance = 300;
        const circumference = 40075;
        const oneDegreeOfLatitudeInMeters = 111.32 * 1000;
        const angularDistance = distance/circumference;

        const latitudeDelta = distance / oneDegreeOfLatitudeInMeters
        const longitudeDelta = Math.abs(Math.atan2(
                Math.sin(angularDistance)*Math.cos(lat),
                Math.cos(angularDistance) - Math.sin(lat) * Math.sin(lat)))

        return {
            latitude: lat,
            longitude: lon,
            latitudeDelta,
            longitudeDelta,
        }
    }