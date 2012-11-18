var http = require("http")
var url = require("url")
var weibo = require("weiboapi")
var fs = require("fs")
var api = null
var visitor = 0
var servTest = function()
{
  var mem = process.memoryUsage()
  if(visitor++ % 10 ==0 )
    console.log('visitor : ' + visitor +
                '  heapTotal : ' + mem.heapTotal +
                '  heapUsed : '  + mem.heapUsed)
 
}

weibo.login('birdroid@126.com','xx',function (err,API){
  if(!err){
      api = API
  }else{
    console.log('login fail')}
  }
)

http.createServer(function(requst,response){
  
  servTest()
  
  var uri = url.parse(requst.url,true)
  process.heapTotal,process.heapUsed
  if(uri.pathname == '/getuser'){
    response.writeHeader(200,{"Content-type":"application/json;charset=utf-8",
                                      Server:'nodejs'
    })
    if(api){
      api.searchUser(uri.query,function(err,result){
        response.write(JSON.stringify(result || ''))
        response.end()
      })
    }else{
      response.write('go wrong!')
      response.end()
    }
  }else if(uri.pathname == '/'){
    var content = fs.readFileSync('static/index.html', 'utf8')
    response.writeHeader(200,{"Content-type":"text/html;charset=utf-8"})
    response.write(content)
    response.end()
  }else{
    response.write('address wrong')
    response.end()
  }
  
}).listen(8888)

process.on('uncaughtException',function(err){
  console.log(err.stack)
})