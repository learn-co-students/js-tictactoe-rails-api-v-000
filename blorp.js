const fs = require("fs")

function fileReaderAsync(fileName, cb) {
  console.log("fileReader entry");
  fs.readFile(fileName, function (_error, content) {
    cb(content)
  })
  console.log("fileReader exit");
}

console.log("before call");
fileReaderAsync("blorp.js", function (result) {
  console.log(result);
})
console.log("after call");
