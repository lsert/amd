class AMD {
    constructor() {
        this.modules = {};
        this.requireList = [];
    }
    loadJs(id, callback) {
        let script = document.createElement('script');
        script.setAttribute('src', id);
        script.setAttribute('require-id', id);
        document.head.appendChild(script);
        this.modules[id].status = 1;
        return new Promise((resolve, reject) => {
            script.onload = () => {
                resolve(true);
                callback(id);
                this.onScriptLoad(id);
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
        //根据deps建立模块机制
        deps.map(dep => {
            if (modules[dep]) {
                return;
            }
            modules[dep] = {
                status: 0,
                id: dep
            }
            this.loadJs(dep, () => {
                modules[dep].status = 2;
            });
        });

        this.requireList.push({
            deps,
            factory: callback
        });
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
        let cur_id = document.currentScript.getAttribute("require-id");
        this.modules[cur_id].deps = deps;
        this.modules[cur_id].factory = callback;

        // 没有依赖的情况下
        if (deps.length === 0) {
            this.modules[cur_id].deps = [];
            this.modules[cur_id].module = {
                exports: callback()
            };
            return;
        }

        //根据deps建立模块机制
        deps.map(dep => {
            if (modules[dep]) {
                return;
            }
            modules[dep] = {
                status: 0,
                id: dep
            }
            this.loadJs(dep, () => {
                modules[dep].status = 2;
            });
        });
    }
}

let amd = new AMD();
window.require = amd.require.bind(amd);
window.define = amd.define.bind(amd);