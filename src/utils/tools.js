'use strict'

// 工具包：普通js常用方法

/**
 * 复制对象，除去数组noNeedFileds中的字段
 * @param {*} from 源对象
 * @param  {...any} noNeedFileds 不复制的字段
 */
export function optionalCopy(from, ...noNeedFileds) {
  if (!from) {
    return {}
  }
  return Object.entries(from).reduce((ret, [key, value]) => {
    if (!flat(noNeedFileds).includes(key)) {
      ret[key] = value
    }
    return ret
  }, {})
}

/**
 * 复制from表单对象，空值不复制
 * @param {*} from 源对象
 * @param  {...any} noNeedFileds 不复制的字段
 */
export function optionalFormCopy(from, ...noNeedFileds) {
  if (!from) {
    return {}
  }
  return Object.entries(from).reduce((ret, [key, value]) => {
    if (isDataType(value, 'null', 'undefined')) {
      return ret
    }
    if (!flat(noNeedFileds).includes(key)) {
      ret[key] = value
    }
    return ret
  }, {})
}

/**
 * 判断数据的类型是否符合预期
 * 只传一个参数data，则返回数据的类型；
 * 传入多个参数，则判断数据是否属于该类型（或属于类型数组中的一个）
 * @param {*} data 需要判断类型的数据
 * @param  {...any} typeList 字符串或字符串数组，可不传
 */
export function isDataType(data, ...typeList) {
  let dataType = Object.prototype.toString.call(data)
    .replace(/^\[object/, '')
    .replace(/\]$/, '')
    .replace(/\s/, '')
  typeList = flat(typeList)
  let hasType = typeList.some(it => {
    return it && isDataType(it) === 'String'
  })
  if (!hasType) {
    return dataType
  }
  if (typeList.includes(dataType) || typeList.includes(dataType.toLowerCase())) {
    return true
  }
  return false
}

/**
 * 从参数中获取所有Promise对象，组成数组并返回
 * @param  {...any} datas 待解析数据
 */
export function getAllPromise(...datas) {
  let promiseList = []
  datas.forEach(it => {
    if (isDataType(it, 'Promise')) {
      promiseList.push(it)
      return
    }
    // 是方法则获取执行的结果
    if (isDataType(it, 'Function')) {
      promiseList.push(...getAllPromise(it()))
      return
    }
    if (isDataType(it, 'Array')) {
      promiseList.push(...getAllPromise(...it))
    }
  })
  return promiseList
}

/**
 * 获取指定月的天数；传入多个月份，则返回所有月天数之和
 * @param  {...any} monthList 月份
 */
export function getDayCount(...monthList) {
  let allMonthDay = [31, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30]
  let now = new Date()
  return flat(monthList).reduce((total, current) => {
    let m = ~~current
    if (m % 12 === -10 || m % 12 === 2) {
      // 2月份天数单独算
      let year = now.getFullYear() + ~~(m / 12)
      let day = year % 4 === 0 ? 29 : 28
      return total + day
    }
    if (m < 0) {
      return total + allMonthDay[12 + m % 12]
    }
    return total + allMonthDay[m % 12]
  }, 0)
}

/**
 * Array.flat在app和Trident内核上会报错，重写
 * @param {Array} list 目标数组
 */
export function flat(list) {
  if (Array.prototype.flat) {
    return list.flat(Infinity)
  }
  let retArr = []
  if (!Array.isArray(list)) {
    throw new Error(`Invalid parameter: type check failed for parameter 'list'. Expected Array, But got ${typeof list} with value ${list}`)
  }
  list.forEach(it => {
    if (!Array.isArray(it)) {
      retArr.push(it)
      return
    }
    retArr.push(...flat(it))
  })
  return retArr
}
