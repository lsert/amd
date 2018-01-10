CommonJS 和 ES6 Module，webpack对其实现。

commonJS的用法。

```
// file "main";

let c = require("./a.js");
console.log(c);


// file "a"

let m = "this is module a";
module.export = m;
```

CommonJS的简单实现
```
let modules = {
    0:function (module,exports,require){
        let c = require("./a.js");
    },

    './a.js': function(module,exports,require){
        let m = "this is module a";
        module.export = m;
    }
}

(function(modules){
    let moduleCache = {};
    function require(id){
        if(moduleCache[id]){
            return moduleCache[id].exports;
        }
        let module = {
            id:id,
            exports:{},
            loaded:false
        };
        modules[moduleId].call(module.exports, module, module.exports, modules);
        module.loaded = true;
        return module.exports
    }
    require(0);
}(modules));

```

CommonJS和ES Module的区别  
1. CommonJS是执行时加载模块，ES Module是编译时期加载模块。
2. CommonJS的模块的值是值的拷贝。ES Module模块的值是值的引用。
3. CommonJS的模块export本身是一个对象。ES Module的export不是一个对象。

区别1：  
CommonJS的模块加载是在运行时候处理的。所以你可以根据当前的上下文去加载不同的模块。
```
require("./a"+this.state.id);
```
上述代码中 如果能找到该模块，就可以正常的加载使用。

而ES Module的加载是在编译时期就发生的。所以你不能根据上下文去判断一个模块要不要加载
```
// 错误写法:
if(a){
    import A from "./a.js";
    A();
} else {
    import B from "./b.js";
    B();
}


// 正确写法
import A from "./a.js";
import B from "./b.js";

if(a) {
    A();
} else {
    B();
}
```

// 简单的说就是一个是在运行时去查询模块，并加载运行，一个是在编译期间就处理好模块。

ES Module的特性
