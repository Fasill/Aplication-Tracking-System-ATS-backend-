export function giveCurrentDateTime() {
    const currentDateTime = new Date();
    
    const year = currentDateTime.getFullYear();
    const month = String(currentDateTime.getMonth() + 1).padStart(2, '0');
    const day = String(currentDateTime.getDate()).padStart(2, '0');
    const hours = String(currentDateTime.getHours()).padStart(2, '0');
    const minutes = String(currentDateTime.getMinutes()).padStart(2, '0');
    const seconds = String(currentDateTime.getSeconds()).padStart(2, '0');
  
    const formattedDateTime = `${year}-${month}-${day}_${hours}:${minutes}:${seconds}`;
    return formattedDateTime;
  }
  