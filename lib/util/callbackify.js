export default function(promise, callback) {
  if (typeof callback === 'function') {
    promise.then(obj => callback(null, obj), err => callback(err, null));
  }
}
