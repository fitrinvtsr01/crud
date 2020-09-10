var http = require('http')
var pug = require('pug')
var NodeSession = require('node-session')

var mainPug = "./templates/main.pug"
var page1Pug = "./templates/page1.pug"
var page2Pug = "./templates/page2.pug"

//membuat session
var session = new NodeSession({
    'secret': 'Q3UBzdH9GEfiRCTKbi5MTPyChpzXLsTD'

});

var server = http.createServer(function (request, response) {
    //mengaktifkan session
    session.startSession(request, response, function () {
        response.writeHead(200, {
            "Content-Type": "text/html"
        })
        if (request.url === "/") {
            //mendaftarkan variable kedalam request session
            request.session.put("var1", "Pemrograman Node Js")

            //tampilkan ke halaman utama
            var template = pug.renderFile(mainPug);
            response.end(template);

        } else if (request.url === "/page1") {
            // if (request.session.has("var1")) {
            //     //mengambil nilai variable dari dalam session dari hlaman1
            //     var value = request.session.get("var1");
            // } else {
            //     var value = "tidak ada nilai session"
            // }

            // mengambil nilai variable dari dalam session dari hlaman1
            var value = request.session.get("var1");

            // console.log(value);
            //menampilkanke halaman 1
            var template = pug.renderFile(page1Pug, {
                var1: value
            })
            response.end(template)
        } else if (request.url === "/page2") {
            //mengambil nilai variable dari dalam session dari hlaman1
            var value = request.session.get("var1")

            //hapus session
            // request.session.foget('var1')
            // request.session.flush();

            //menampilkanke halaman 2
            var template = pug.renderFile(page2Pug, {
                var1: value
            });
            response.end(template);
        } else {
            response.end("halaman tidak ditemukan!")
        }
    })
})
server.listen(3000)