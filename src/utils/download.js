function saveFile(filename, data, mimetype) {
  var blob = new Blob([data], {type: mimetype});
  if(window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(blob, filename);
  } else {
    var elem = window.document.createElement('a');
    elem.href = window.URL.createObjectURL(blob, { oneTimeOnly: true });
    elem.download = filename;
    elem.style.display = 'none';
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
  }
}

module.exports = { saveFile }
