// format a number to a more human readable representation,
// could use Number.toLocaleString() to add international representation
function formatNumber(num) {
    if (num > 999 && num < 1000000) {
        return (num/1000).toFixed(1) + 'K'; // convert to K 
    } else if (num > 1000000) {
        return (num/1000000).toFixed(1) + 'M'; // convert to M 
    } else if (num < 900) {
        return num;}
    
    }

function formatStringToOnlyDate(strDate){
    d = new Date(new Date(strDate).toUTCString())
    return d.getFullYear() +"-"+ ("0" + (d.getMonth() + 1)).slice(-2) +"-"+ ("0" + d.getDate()).slice(-2)
}


module.exports =  {formatNumber, formatStringToOnlyDate}
