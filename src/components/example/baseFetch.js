
/**
 * 发送GET请求的专用函数
 * @param {string} url 请求的URL
 * @param {Object} params 查询参数对象
 * @returns {Promise} 返回一个Promise，解析为响应数据
 */
export default function fetchGet(url, params = {}) {
    // 构建带有查询参数的URL
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = `${url}?${queryString}`;

    // 设置默认的headers和其他配置
    const options = {
        method: 'GET'
    };
    // 使用fetch发送GET请求
    return fetch(fullUrl, options)
        .then(response => {
            if (!response.ok) {//
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json().then(data => {
                if (data.code === 1) {
                    throw new Error(data.msg);
                }
                if(Object.hasOwn(data,'data'))
                    return data.data;
            }); // 解析JSON数据
        })
        .catch(error => {
            console.error('Fetch error:', error);
            throw error;
        });
}
/**
 * 发送POST请求的专用函数
 * @param {string} url 请求的URL
 * @param {Object} params 请求体参数对象
 * @returns {Promise} 返回一个Promise，解析为响应数据
 */
export default function fetchPost(url, params = {}) {
    // 设置请求头和请求体
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params) // 将参数转换为JSON字符串
    };

    // 使用fetch发送POST请求
    return fetch(url, options)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json().then(data => {
                if (data.code === 1) {
                    throw new Error(data.msg);
                }
                if(Object.hasOwn(data,'data'))
                    return data.data;
            }); // 解析JSON数据
        })
        .catch(error => {
            console.error('Fetch error:', error);
            throw error;
        });
}
/**
 * 发送POST请求的专用函数，支持文件上传
 * @param {string} url 请求的URL
 * @param {FormData} formData 包含文件和其他数据的FormData对象
 * @returns {Promise} 返回一个Promise，解析为响应数据
 */
export default function upload(url, params={}) {
    const formData = new FormData();
    // 遍历json对象，将属性添加到formData中
    for (const key in params) {//不能处理嵌套对象
        console.log(key);
        if (Object.hasOwn(params,key)) {
            formData.append(key, params[key]);
        }
    }
    // 设置请求选项，不需要手动设置Content-Type，浏览器会自动设置正确的类型
    const options = {
        method: 'POST',
        body: formData // 直接使用FormData对象作为请求体
    };
    // 使用fetch发送POST请求
    return fetch(url, options)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json().then(data => {
                if (data.code === 1) {
                    throw new Error(data.msg);
                }
                if(Object.hasOwn(data,'data'))
                    return data.data;
            }); // 解析JSON数据
        })
        .catch(error => {
            console.error('Fetch error:', error);
            throw error;
        });
}
/*function jsonToFormData(json, formData = new FormData(), parentKey = null) {
    if (json && typeof json === 'object' && !(json instanceof Date) && !(json instanceof File)) {
        Object.keys(json).forEach(key => {
            const fullKey = parentKey ? `${parentKey}[${key}]` : key;
            jsonToFormData(json[key], formData, fullKey);
        });
    } else {
        formData.append(parentKey, json);
    }
    return formData;
}
*/