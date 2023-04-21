function formatDate(dateString) {
    if (dateString === null || dateString === undefined) {
      return "";
    }
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${day}/${month}/${year}, ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

export default formatDate;