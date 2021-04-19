const utils = {
  //返回数据类型
  type:(para) => Object.prototype.toString.call(para).slice(8,-1),
    /**
   * 函数防抖 (只执行最后一次点击)
   */
  debounce:(fn, t) => {
    let delay = t || 500;
    let timer;
    return function () {
        let args = arguments;
        if(timer){
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            timer = null;
            fn.apply(this, args);
        }, delay);
    }
  },
  /*
  * 函数节流（一段时间内只执行一次）
  */
  throttle:(fn, t) => {
    let last;
    let timer;
    let interval = t || 500;
    return function () {
        let args = arguments;
        let now = +new Date();
        if (last && now - last < interval) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                last = now;
                fn.apply(this, args);
            }, interval);
        } else {
            last = now;
            fn.apply(this, args);
        }
    }
  },
  //柯里化
  curry:(fn)=>{
    let judge = (...args) =>{
      if(args.length >= fn.length)return fn(...args);
      return (...arg) => judge(...args,...arg)
    }
    return judge
  },
  unique:(arr)=>{
    // ES5
    // let newArr = arr.filter((item,index,array)=>{
    //   return array.indexOf(item) === index;
    // })
    // return newArr
    // ES6 || return Array.from(arr)
    return [...new Set(arr)]
  },
  parseParam:(url) =>{
    const paramsStr = /.+\?(.+)$/.exec(url)[1]; // 将 ? 后面的字符串取出来
    const paramsArr = paramsStr.split('&'); // 将字符串以 & 分割后存到数组中
    let paramsObj = {};
    // 将 params 存到对象中
    paramsArr.forEach(param => {
        if (/=/.test(param)) { // 处理有 value 的参数
            let [key, val] = param.split('='); // 分割 key 和 value
            val = decodeURIComponent(val); // 解码
            val = /^\d+$/.test(val) ? parseFloat(val) : val; // 判断是否转为数字
    
            if (paramsObj.hasOwnProperty(key)) { // 如果对象有 key，则添加一个值
                paramsObj[key] = [].concat(paramsObj[key], val);
            } else { // 如果对象没有这个 key，创建 key 并设置值
                paramsObj[key] = val;
            }
        } else { // 处理没有 value 的参数
            paramsObj[param] = true;
        }
    })
    return paramsObj;
  } 
}
