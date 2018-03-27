(function (factoryLib) {
    // modules lib
    const modules = {};
    function require(id) {
        if (modules[moduleId]) {
            return modules[id].exports;
        }

        if (!factoryLib.hasOwnProperty(id)) {
            throw new Error('can not find module', id);
        }
        // data constructor
        let module = modules[id] = {
            id: id,
            exports: {},
            filename: '',
            loaded: false,
            children: [],
            paths: [],
            factory: factoryLib[id]
        };
        module.factory.call(module, require, module, module.exports);
        module.loaded = true;
        return module.exports;
    }
    require.cache = modules;
    require.defineProperty = function (exports, name, getter) {
        
    }
}(
    {
        0: function (require, module, exports) {

        },
        './index': function (require, module, exports) {
            module.exports = "this is index";
        },
    }
))


require.p    // public path;
require.m    // modules
require.c    // installedModules
require.d    // define getter
require.n    // getDefaultExport
require.o    // check hasOwnProperty
require.s    // entry module id

// 检测到是ES Module,给exports定义一个__esModule为 true的属性
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
var __WEBPACK_IMPORTED_MODULE_0__a__ = __webpack_require__(1);


// require(X) from module at path Y
// 1. If X is a core module,
//    a. return the core module
//    b. STOP
// 2. If X begins with '/'
//    a. set Y to be the filesystem root
// 3. If X begins with './' or '/' or '../'
//    a. LOAD_AS_FILE(Y + X)
//    b. LOAD_AS_DIRECTORY(Y + X)
// 4. LOAD_NODE_MODULES(X, dirname(Y))
// 5. THROW "not found"

// LOAD_AS_FILE(X)
// 1. If X is a file, load X as JavaScript text.  STOP
// 2. If X.js is a file, load X.js as JavaScript text.  STOP
// 3. If X.json is a file, parse X.json to a JavaScript Object.  STOP
// 4. If X.node is a file, load X.node as binary addon.  STOP

// LOAD_INDEX(X)
// 1. If X/index.js is a file, load X/index.js as JavaScript text.  STOP
// 2. If X/index.json is a file, parse X/index.json to a JavaScript object. STOP
// 3. If X/index.node is a file, load X/index.node as binary addon.  STOP

// LOAD_AS_DIRECTORY(X)
// 1. If X/package.json is a file,
//    a. Parse X/package.json, and look for "main" field.
//    b. let M = X + (json main field)
//    c. LOAD_AS_FILE(M)
//    d. LOAD_INDEX(M)
// 2. LOAD_INDEX(X)

// LOAD_NODE_MODULES(X, START)
// 1. let DIRS=NODE_MODULES_PATHS(START)
// 2. for each DIR in DIRS:
//    a. LOAD_AS_FILE(DIR/X)
//    b. LOAD_AS_DIRECTORY(DIR/X)

// NODE_MODULES_PATHS(START)
// 1. let PARTS = path split(START)
// 2. let I = count of PARTS - 1
// 3. let DIRS = []
// 4. while I >= 0,
//    a. if PARTS[I] = "node_modules" CONTINUE
//    b. DIR = path join(PARTS[0 .. I] + "node_modules")
//    c. DIRS = DIRS + DIR
//    d. let I = I - 1
// 5. return DIRS