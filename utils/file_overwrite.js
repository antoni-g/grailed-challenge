var fs = require('fs');

var copy_file = function(src,tgt,callback) {
fs.copyFile(src, tgt, (err) => {
      if (err) {
        callback(err);
      }
      else {
        callback(null, src+' successfully copied into '+tgt);
      }
	});
}

// table of all exported functions
const calls = {
  copy_file: copy_file
}

module.exports = calls;