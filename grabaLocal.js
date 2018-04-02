
function onInitFs(fs) {
    console.log('Opened file system: ' + fs.name);
  }
  
  window.requestFileSystem(window.TEMPORARY, 5*1024*1024 /*5MB*/, onInitFs, errorHandler);


  function errorHandler(e) {
    var msg = '';
  
    switch (e.code) {
      case FileError.QUOTA_EXCEEDED_ERR:
        msg = 'QUOTA_EXCEEDED_ERR';
        break;
      case FileError.NOT_FOUND_ERR:
        msg = 'NOT_FOUND_ERR';
        break;
      case FileError.SECURITY_ERR:
        msg = 'SECURITY_ERR';
        break;
      case FileError.INVALID_MODIFICATION_ERR:
        msg = 'INVALID_MODIFICATION_ERR';
        break;
      case FileError.INVALID_STATE_ERR:
        msg = 'INVALID_STATE_ERR';
        break;
      default:
        msg = 'Unknown Error';
        break;
    };
  
    console.log('Error: ' + msg);
  }

  window.webkitStorageInfo.requestQuota(PERSISTENT, 1024*1024, function(grantedBytes) {
    window.requestFileSystem(PERSISTENT, grantedBytes, onInitFs, errorHandler);
  }, function(e) {
    console.log('Error', e);
  });


  function onInitFs(fs) {

    fs.root.getFile('log.txt', {}, function(fileEntry) {
  
      // Get a File object representing the file,
      // then use FileReader to read its contents.
      fileEntry.file(function(file) {
         var reader = new FileReader();
  
         reader.onloadend = function(e) {
           var txtArea = document.createElement('textarea');
           txtArea.value = this.result;
           document.body.appendChild(txtArea);
         };
  
         reader.readAsText(file);
      }, errorHandler);
  
    }, errorHandler);
  
  }
  
  window.requestFileSystem(window.TEMPORARY, 1024*1024, onInitFs, errorHandler);


  //Crea un archivo si no existe

  function onInitFs(fs) {
          console.log('Opened file system: ' + fs.name);
    
    fs.root.getFile('log.txt', {create: true}, function(fileEntry) {
  
      // Create a FileWriter object for our FileEntry (log.txt).
      fileEntry.createWriter(function(fileWriter) {
  
        fileWriter.onwriteend = function(e) {
          console.log('Write completed.');
        };
  
        fileWriter.onerror = function(e) {
          console.log('Write failed: ' + e.toString());
        };
  
        // Create a new Blob and write it to log.txt.
        var blob = new Blob(['Lorem Ipsum'], {type: 'text/plain'});
  
        fileWriter.write(blob);
  
      }, errorHandler);
  
    }, errorHandler);
  
  }
  
  window.requestFileSystem(window.TEMPORARY, 1024*1024, onInitFs, errorHandler);

  //Añadir en un archivo DA ERROR SI NO EXISTE EL ARCHIVO

  function onInitFs(fs) {

    fs.root.getFile('log.txt', {create: false}, function(fileEntry) {
  
      // Create a FileWriter object for our FileEntry (log.txt).
      fileEntry.createWriter(function(fileWriter) {
  
        fileWriter.seek(fileWriter.length); // Start write position at EOF.
  
        // Create a new Blob and write it to log.txt.
        var blob = new Blob(['Hello World'], {type: 'text/plain'});
  
        fileWriter.write(blob);
  
      }, errorHandler);
  
    }, errorHandler);
  
  }
  
  window.requestFileSystem(window.TEMPORARY, 1024*1024, onInitFs, errorHandler);