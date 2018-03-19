class AMD {
    constructor() {
        this.modules = {};
        this.requireList = [];
    }
    loadJs(id, callback1, callback2) {
        let script = document.createElement('script');
        script.setAttribute('src', id);
        script.setAttribute('require-id', id);
        document.head.appendChild(script);
        callback1(id);
        return new Promise((resolve, reject) => {
            script.onload = () => {
                resolve(true);
            }
        })
    }
    onScriptLoad() {
        this.checkDeps(this.requireList);
    }
    depsLoop(deps, modules) {
        return deps.every(dep => {
            let current_dep_module = modules[dep];
            if (current_dep_module) {
                //若加载完毕了 依然递归检测
                if (current_dep_module.status === 2) {
                    if (current_dep_module.deps.length > 0) {
                        return this.depsLoop(current_dep_module.deps, modules);
                    }
                    return true;
                }
            }
            return false;
        })
    }

    checkDeps(requireList) {
        let checked;
        let modules = this.modules;
        requireList.every(({ deps, factory }) => {
            if (this.depsLoop(deps, modules)) {
                this.run(deps, factory);
            };
        });
    }
    require(deps, callback) {
        let modules = this.modules;
        this.requireList.push({
            deps,
            factory: callback
        });
        let allLoaded = true;
        // 迭代依赖
        for (let i = 0; i < deps.length; i++) {
            let dep = deps[i];
            // 若已经存在，则表示创建过，不再进行加载
            if (modules[dep]) {
                continue;
            }
            // 处理是否全部被在加载了
            allLoaded = false;
            // 创建当前模块的对象
            modules[dep] = {
                status: 0,
                id: dep,
                exports: {}
            };
            // 加载js
            this.loadJs(dep, () => {
                // 添加到dom后盖改变状态
                this.modules[id].status = 1;
            }).then(id => {
                // 加载完毕后改变状态
                this.modules[id].status = 2;
                // 执行加载完毕后的代码
                this.onScriptLoad();
            });
        }
        //若已经在加载或者加载完毕，check一下
        if (allLoaded) {
            this.onScriptLoad();
        }
    }
    run(deps, callback) {
        let result = deps.map(dep => {
            let cur_module = this.modules[dep];
            // 如果已经存在 则无需处理直接用
            if (cur_module.hasOwnProperty('module')) {
                return cur_module.module.exports;
            }
            return this.run(cur_module.deps, cur_module.factory)
        });
        return callback(...result);
    }
    define(deps, callback) {
        let modules = this.modules;
        // 获取当前正在运行的js的模块的id
        let cur_id = document.currentScript.getAttribute("require-id");
        // 给模块添加依赖属性
        this.modules[cur_id].deps = deps;
        // 给模块添加factory属性
        this.modules[cur_id].factory = callback;
        // 没有依赖的情况下
        if (deps.length === 0) {
            // 空依赖
            this.modules[cur_id].deps = [];
            // 直接跑callback获得exports的值
            this.modules[cur_id].module = {
                exports: callback()
            };
            return;
        }
        //重复require部分逻辑
        let allLoaded = true;
        // 迭代依赖
        for (let i = 0; i < deps.length; i++) {
            let dep = deps[i];
            // 若已经存在，则表示创建过，不再进行加载
            if (modules[dep]) {
                continue;
            }
            // 处理是否全部被在加载了
            allLoaded = false;
            // 创建当前模块的对象
            modules[dep] = {
                status: 0,
                id: dep,
                exports: {}
            };
            // 加载js
            this.loadJs(dep, () => {
                // 添加到dom后盖改变状态
                this.modules[id].status = 1;
            }).then(id => {
                // 加载完毕后改变状态
                this.modules[id].status = 2;
                // 执行加载完毕后的代码
                this.onScriptLoad();
            });
        }
        //若已经在加载或者加载完毕，check一下
        if (allLoaded) {
            this.onScriptLoad();
        }
    }
}

let amd = new AMD();
window.require = amd.require.bind(amd);
window.define = amd.define.bind(amd);
// 执行require
// 解析require的第一个参数，该参数为数组,且数组里面的每个值为依赖项
// 迭代数组中的依赖
// 若依赖已经存在，则continue
// 若依赖不存在，则新建该依赖的初始值
// 通过loadJs 加载该模块,// 将当前的依赖和callback存入 requireList。
// 新建script标签，并添加到页面。
// script.onLoad 以后，检查依赖项
// 检查requireList中的依赖模块是否全部加载完毕
// 若加载完毕，则从新执行requireList中的代码。