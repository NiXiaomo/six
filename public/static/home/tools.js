// 截取指定长度字符串
function subtext(str, length) {
    // 先转字符串
    str = entityToString(str);
    // 截取
    if (str.length > length) {
        str = str.substr(0, 100) + '...';
    }
    // 再转实体
    str = stringToEntity(str);
    return str;
}

// html实体转字符串
function entityToString(entity) {
    var div = document.createElement('div');
    div.innerHTML = entity;
    return div.innerText || div.textContent;
}

// 字符串转html实体
function stringToEntity(str) {
    var div = document.createElement('div');
    div.innerText = str;
    div.textContent = str;
    return div.innerHTML;
}