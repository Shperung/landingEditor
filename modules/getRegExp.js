module.exports = (id) => new RegExp('<(\\w+)\\s[^>]*id=\\"'+id+'\\"[^>]*>[\\s\\S]*?\\1>', "gim");