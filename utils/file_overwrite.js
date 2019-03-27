var fs = require('fs');
const log = require('debug')('file_overwrite');

var copyFile = function(src, tgt, callback) {
  fs.copyFile(src, tgt, (err) => {
    if (err) {
      log(`error copying file ${src} into ${tgt}`);
      callback(err);
    }
    else {
      log(`successfully copied file ${src} into ${tgt}`);
      callback(null, `successfully copied file ${src} into ${tgt}`);
    }
	});
}

var delFile = function(tgt, callback) {
  fs.unlink(tgt, (err) => {
    if (err) {
      log(`error deleting file ${tgt}`);
      callback(err);
    }
    else {
      log(`successfully deleted file ${tgt}`);
      callback(null, `successfully deleted ${tgt}`);
    }
  });
}

// table of all exported functions
const calls = {
  copy_file: copyFile,
  del_file: delFile
}

module.exports = calls;