var http = require("http")
var url = require("url")
var weibo = require("weiboapi")
var fs = require("fs")
var api = null

weibo.login('birdroid@126.com','birdroid345',function (err,API){
  if(!err){
      api = API
  }
})
http.createServer(function(requst,response){
  var uri = url.parse(requst.url,true)

  if(uri.pathname == '/getuser'){
    var expTime = Date.now() + 24*60*60*1000
    response.writeHeader(200,{"Content-type":"application/json;charset=utf-8",
      Server:'nodejs',
      "Cache-control": 'max-age=' + 24*60*60,
      Expires:(new Date(expTime)).toGMTString()
    })
    if(api){
      api.searchUser(uri.query,function(err,result){
        response.write(JSON.stringify(result))
        response.end()
      })
    }else{
      response.write('go wrong!')
      response.end()
    }
  }else if(uri.pathname == '/'){
    var content = fs.readFileSync('beauty/static/index.html', 'utf8')
    response.writeHeader(200,{"Content-type":"text/html;charset=utf-8"})
    response.write(content)
    response.end()
  }else{
    response.write('address wrong')
    response.end()
  }
}).listen(8888)

process.on('uncaughtException',function(err){
  console.log(err)
})