module.exports = {
  info: (...args) => console.log.apply(console, args),
  error: (...args) => console.error.apply(console, args),
}