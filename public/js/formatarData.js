function formatarData(dataString) {
    if(!dataString) return ''

    const data = new Date(dataString);
    if(isNaN(data.getTime())) return dataString
    
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

module.exports = formatarData