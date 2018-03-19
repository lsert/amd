const http = require('http');
const url = require('url');
const querystring = require('querystring');
const Stream = require('stream');
class DeRequest {
    constructor(request) {
        this.headers = request.headers;
        this.method = request.method;
        this.url = url.parse(request.url);
        this.url.queryObject = querystring.parse(this.url.query);
        this.request = request;
    }
}
class App {
    constructor(server) {
        this.middlewareList = [];
        this.finishedList = [];
        this.server = server;
    }
    onFinished(fn) {
        if (typeof fn === 'function') {
            this.finishedList.push(fn);
        }
    }
    request(request, response) {
        let req = new DeRequest(request);
        let ctx = {
            headers: { 'x-powered-by': "mink" },
            body: null,
            status: 200,
            response,
        };
        // 处理中间件
        let ml = this.middlewareList;
        let nextArg = undefined;
        (async () => {
            for (let i = 0; i < ml.length; i++) {
                let m = ml[i];
                let isErrHandler = m.length === 3;
                let result;
                // 是错误处理中间件 且 nextArg不是undefinedƒ
                if (nextArg !== undefined) {
                    if (isErrHandler) {
                        result = await m(nextArg, req, ctx).catch(err => err);
                        nextArg = result;
                    }
                } else {
                    result = await m(req, ctx).catch(err => err);
                    nextArg = result;
                }
                if (result === false) {
                    break;
                }
            }
        })().then(() => {
            response.writeHead(ctx.status, ctx.headers);
            let resbody;
            if (ctx.body instanceof Stream) {
                resbody = ctx.body;
            } else if (typeof ctx.body === 'object') {
                try {
                    resbody = JSON.stringify(ctx.body);
                } catch (e) {
                    resbody = String(ctx.body);
                }
            } else {
                resbody = String(ctx.body);
            }
            response.write(resbody);
            response.end();
        }).catch(res => {
            console.log(res);
        }).then(res => {
            this.finishedList.map((fn) => {
                try {
                    fn(req, ctx);
                } catch (e) {
                    console.log(e);
                }
            });
        });
    }
    listen(port) {
        this.server.listen(port);
        return this;
    }
    use(...callback) {
        this.middlewareList.push(...callback);
    }
}
function mink(http) {
    let app = new App(http.createServer(function (...arg) {
        app.request.apply(app, arg);
    }));
    return app;
}

let app = mink(http).listen('8000');
let sybTime = Symbol();
app.use(async (req, ctx) => {
    let time = Date.now();
    ctx[sybTime] = time;
});

app.onFinished(function (req, ctx) {
    console.log(req.method, req.url.path, (Date.now() - ctx[sybTime]) + 'ms', new Date());
});

app.use(async (req, ctx) => {
    ctx.body = "hello world";
    ctx.status = 200;
    return false;
});

app.use(async (req, ctx) => {
    ctx.body = "404 not found";
    ctx.status = 404;
    return '404 not found';
});
app.use(async (req, ctx) => {
    121234();
});

app.use(async (req, ctx) => {
    console.log(req, ctx);
});

app.use(async (err, req, ctx) => {
    if (err instanceof Error) {
        ctx.body = err.stack;
    } else {
        ctx.body = String(err);
    }
    ctx.status = ctx.status || 500;
})