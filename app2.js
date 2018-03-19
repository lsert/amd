const mink = require('./mink/mink');

const app = mink(http).listen('8000');

// log时间
let sybTime = Symbol();
app.use(async (req, ctx) => {
    ctx[sybTime] = Date.now();
});
app.onFinished(function (req, ctx) {
    console.log(req.method, req.url.path, (Date.now() - ctx[sybTime]) + 'ms', new Date());
});

// 处理正常的200;
app.use(async (req, ctx) => {
    ctx.body = "hello world";
    ctx.status = 200;
    // 返回false表示不会再往下执行
    return false;
});

app.use(async (req, ctx) => {
    ctx.body = "404 not found";
    ctx.status = 404;
    return '404 not found';
});


// 参数为3个的中间件表示处理next(err)信息的;
app.use(async (err, req, ctx) => {
    if (err instanceof Error) {
        ctx.body = err.stack;
    } else {
        ctx.body = String(err);
    }
    ctx.status = ctx.status || 500;
})