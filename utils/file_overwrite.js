var fs = require('fs');

var copyFile = function(src,tgt,callback) {
  fs.copyFile(src, tgt, (err) => {
    if (err) {
      callback(err);
    }
    else {
      callback(null, src+' successfully copied into '+tgt);
    }
	});
}

var delFile = function(tgt,callback) {
  fs.unlink(tgt, (err) => {
    if (err) {
      callback(err);
    }
    else {
      callback(null,'successfully deleted '+tgt);
    }
  });
}

// table of all exported functions
const calls = {
  copy_file: copyFile,
  del_file: delFile
}

module.exports = calls;