export function error(msg){
    ElMessage({
        message:msg,
        type: 'warning',
    })
}
export function ok(msg=`All Done!`){
    ElMessage({
        type: 'success',
        message: msg,
    });
}
export function table(url,tableData) {
    fetchGet(url).then(data => {
        tableData.value = data;
    });
}
export function shareLink(url) {
    fetchPost(url, {'key': new URLSearchParams(window.location.search).get('key')}).then(data => {
        if (data !== undefined) {
            ok();
        }
        history.replaceState(null, '', `http://${window.location.host}`);
    });
}
export function input(url,key,params={}){
    return ElMessageBox.prompt('Please provide the details', 'Tip', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
                params[key]=instance.inputValue;
                fetchPost(url, params)
                    .then((data) => {
                        if (data !== undefined) {
                            done();
                        }
                    });
            } else {
                done(); // 取消时直接关闭
            }
        }
    })
}
export function confirm(url,params={}){
    return ElMessageBox.confirm('Are you sure you want to proceed with this action?', 'Warning', {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: 'warning',
            beforeClose: (action, instance, done) => {
                if (action === 'confirm') {
                    fetchPost(url, params)
                        .then((data) => {
                            if (data !== undefined) {
                                done();
                            }
                        });
                } else {
                    done(); // 取消时直接关闭
                }
            }
        }
    )
}
export function copy(url,text,params={}){
    fetchGet(url, params)
        .then((data) => {
            if (data !== undefined) {
                const textToCopy = eval('`' + text + '`');//`🎉 嘿，我刚刚发布了一个新任务，快来加入吧！🚀\n👉 点击这里加入任务: http://${window.location.host}/addParTask?key=${data}\n快来一起完成吧！💪✨`;
                const textarea = document.createElement('textarea');
                textarea.value = textToCopy;
                document.body.appendChild(textarea);
                textarea.select();
                try {
                    document.execCommand('copy');
                    ok(`分享成功！分享内容已复制到剪切板`);
                } catch (err) {
                    error('复制失败，请尝试使用其他浏览器访问');
                } finally {
                    document.body.removeChild(textarea); // 移除临时输入框
                }
            }
        });
}
export function fetchGet(url, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = `http://localhost:8080${url}?${queryString}`;
    const options = {
        method: 'GET'
    };
    return fetch(fullUrl, options)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json().then(data => {
                if (data.code === 1) {
                    error(data.data);console.log(data.data);
                    return undefined;//程序错误/业务错误->undefined；业务正常->null/object
                }
                return (data.data === undefined) ? null : data.data;
            });
        })
        .catch(error => {
            console.error(error);
        });
}
export function fetchPost(url, params = {}) {
    const fullUrl = `http://localhost:8080${url}`;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded' // 修改Content-Type
        },
        body: new URLSearchParams(params).toString() // 将参数转换为urlencoded格式
    };

    return fetch(fullUrl, options)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json().then(data => {
                console.log(data);
                if (data.code === 1) {
                    error(data.data);console.log(data.data);
                    return undefined;
                }
                return (data.data === undefined) ? null : data.data;
            });
        })
        .catch(error => {
            console.error(error);
        });
}
export function upload(url, params={}) {
    const fullUrl = `http://localhost:8080${url}`;
    const formData = new FormData();
    for (const key in params) {//不能处理嵌套对象
        if (Object.hasOwn(params,key)) {
            formData.append(key, params[key]);
        }
    }
    const options = {    // 设置请求选项，不需要手动设置Content-Type，浏览器会自动设置正确的类型
        method: 'POST',
        body: formData
    };
    return fetch(fullUrl, options)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json().then(data => {
                if (data.code === 1) {
                    error(data.data);console.log(data.data);
                    return undefined;
                }
                return (data.data === undefined) ? null : data.data;
            });
        })
        .catch(error => {
            console.error(error);
        });
}

// /**
//  * 发送POST请求的专用函数
//  * @param {string} url 请求的URL
//  * @param {Object} params 请求体参数对象
//  * @returns {Promise} 返回一个Promise，解析为响应数据
//  */
// export function fetchPost(url, params = {}) {
//     // 设置请求头和请求体
//     const options = {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(params) // 将参数转换为JSON字符串
//     };
//
//     // 使用fetch发送POST请求
//     return fetch(url, options)
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }
//             return response.json().then(data => {
//                 if (data.code === 1) {
//                     throw new Error(data.msg);
//                 }
//                 if(Object.hasOwn(data,'data'))
//                     return data.data;
//             }); // 解析JSON数据
//         })
//         .catch(error => {
//             console.error('Fetch error:', error);
//         });
// }
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