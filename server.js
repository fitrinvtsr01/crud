var http = require('http');
var Client = require('mysql2');
var pug = require('pug');
var qs = require('querystring');
var NodeSession = require('node-session');

var mainPug = "./templates/halamanutama.pug";
var loginPug = "./templates/loginform.pug";

var db = Client.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'barang'
});

var session = new NodeSession({
    secret: 'Q3UBzdH9GEfiRCTKbi5MTPyChpzXLsTD'
});

var server = http.createServer(function (request, response) {
    session.startSession(request, response, function () {
        if (request.url === "/") {
            response.writeHead(200, {
                "Content-Type": "text/html"
            });
            var template = pug.renderFile(loginPug);
            response.end(template);
        } else if (request.url === "/login" && request.method === "POST") {
            var body = '';

            request.on('data', function (data) {
                body += data;
            });

            request.on('end', function () {
                var form = qs.parse(body);
                var params = [
                    form['id_user'],
                    form['user_password']
                ];

                var sql = `SELECT COUNT(*) AS cnt FROM user WHERE id_user = ? AND user_password = md5(?)`;
                db.query(sql, params, function (error, result) {
                    if (error) {
                        throw error;
                    }
                    var n = result[0]['cnt'];
                    console.log(`nilai n adalah: ${n}`);
                    if (n > 0) {
                        //login berhasil
                        request.session.put("id_user", params[0]);
                        //redirect ke halaman utama
                        response.writeHead(302, {
                            'Location': '/main'
                        });
                        response.end();
                    } else {
                        response.writeHead(200, {
                            'Content-Type': 'text/html'
                        });
                        var template = pug.renderFile(loginPug, {
                            msg: "User ID atau Password salah!!"
                        });
                        response.end(template);
                    }

                });
            });


        } else if (request.url === "/main") {
            if (!request.session.has('id_user')) {
                //redirect ke halaman login
                response.writeHead(302, {
                    'Location': '/'
                });
                response.end();
            }

            var id_user = request.session.get('id_user');
            response.writeHead(200, {
                'Content-Type': 'text/html'
            });
            //menampilkan ke halaman utama
            var template = pug.renderFile(mainPug, {
                id_user: id_user
            });
            response.end(template);
        } else if (request.url === "/logout") {
            if (request.session.has('id_user')) {
                request.session.forget('id_user');
            }

            //direct ke login
            response.writeHead(302, {
                'Location': '/'
            });
            response.end();
        } else {
            response.writeHead(200, {
                'Content-Type': 'text/html'
            });
            response.end('halaman tidak ditemukan');
        }
    });
});

server.listen(3000);