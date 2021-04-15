const utils = {
//返回数据类型
type:(para) => Object.prototype.toString.call(para).slice(8,-1),
  /**
 * 函数防抖 (只执行最后一次点击)
 */
Debounce:(fn, t) => {
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
Throttle:(fn, t) => {
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
}
}
