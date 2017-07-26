module.exports = function (callback, constructor) {
  if (Promise == null) {
    // this platform doesn't support promises, so use callbacks
    if (callback == null) {
      throw new Error('You did not supply a callback and your platform does not support promises.')
    }
    return constructor(function (res) { callback(null, res) }, function (err) { callback(err, null) })
  }
  var promise = new Promise(constructor)
  // if a callback was supplied, go ahead and attach it to the promise
  if (callback && typeof callback === 'function') {
    promise.then(function (res) {
      callback(null, res)
    }).catch(function (err) {
      callback(err, null)
    })
  }
  return promise
}
