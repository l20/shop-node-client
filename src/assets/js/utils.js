const digitsRE = /(\d{3})(?=\d)/g;

export const currency = (value, currency, decimals) => {
    value = parseFloat(value)
    if (!isFinite(value) || (!value && value !== 0)) return ''
    currency = currency != null ? currency : '$'
    decimals = decimals != null ? decimals : 2
    var stringified = Math.abs(value).toFixed(decimals)
    var _int = decimals
        ? stringified.slice(0, -1 - decimals)
        : stringified
    var i = _int.length % 3
    var head = i > 0
        ? (_int.slice(0, i) + (_int.length > 3 ? ',' : ''))
        : ''
    var _float = decimals
        ? stringified.slice(-1 - decimals)
        : ''
    var sign = value < 0 ? '-' : ''
    return sign + currency + head +
        _int.slice(i).replace(digitsRE, '$1,') +
        _float
}
/**
 * 判断字符是否为空
 * @param {string} str 
 */
export const isNull = (str) => {
    if (str === "") return true;
    let regu = "^[ ]+$";
    let re = new RegExp(regu);
    return re.test(str);
}

/**
 * 测试字符串长度
 * @param {string} str 
 */
export const getStrleng = (str) => {
    if (str == null) return 0;
    if (typeof str != "string") str += "";
    // 单字节转换为双字节在测试长度
    return str.replace(/[^\x00-\xff]/g, "01").length;
}

/**
 * 字符截取
 * @param {string} str 
 * @param {number} n 
 */
export const substring = (str, n) => {//字符串截取 包含对中文处理  
    if (str.replace(/[\u4e00-\u9fa5]/g, "**").length <= n) {
        return str;
    }
    else {
        let len = 0;
        let tmpStr = "";
        for (let i = 0; i < str.length; i++) {//遍历字符串  
            if (/[\u4e00-\u9fa5]/.test(str[i])) {//中文 长度为两字节  
                len += 2;
            }
            else {
                len += 1;
            }
            if (len > n) {
                break;
            }
            else {
                tmpStr += str[i];
            }
        }
        return tmpStr + " ...";
    }
};

/**
 * localstorage操作
 */

// 增加数据
export const addData = (key, value) => {
    if (!window.localStorage) return false;
    else var storage = window.localStorage;

    storage.setItem(key, JSON.stringify(value));
    return true;
}
// 删除指定数据
export const delData = (key) => {
    if (!window.localStorage) return false;
    else var storage = window.localStorage;

    storage.removeItem(key);
}
// 修改数据
export const updateData = (key, value) => {
    return addData(key, value);
}
// 查询数据
export const queryData = (key) => {
    if (!window.localStorage) return false;
    else var storage = window.localStorage;

    return JSON.parse(storage.getItem(key));
}
// 清空数据
export const clearData = () => {
    if (!window.localStorage) return false;
    else var storage = window.localStorage;

    storage.clear();
}

export const hasProperty = function (keys, obj) {
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        let keyName;
        keyName = obj[key]; // 获取参数名称

        if (typeof keyName == 'undefined' || keyName == '' || !keyName) {
            return false;
        }
    }
    return true;
}
