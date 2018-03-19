ECMAScript 2015 (ES2015, formerly ES6) was published almost a year ago. Node.js v6 supports 93% of the ES2015 syntax and features and most modern browsers exceed 90%. However, no JavaScript runtime currently supports ES Modules. (Note that kangax's compatibility table does not yet have an ES Modules column.)

ECMAScript 2015(ES2015,曾经叫 ES6) 已经推出了快一年了。Nodejs v6 支持了 ES2015 93%的语法和特性，大部分的现代浏览器也支持超过90%。然鹅，当前没有任何JavaScript引擎支持ES Modules。

ECMAScript 2015 defines the ES Modules syntax but ECMAScript does not define a "Loader" specification which determines how Modules are inserted into the runtime. The Loader spec is being defined by WHATWG, but is not yet finalized.

ECMAScript 2015 定义了ES Modules 的语法，但是没有给出一个明确的关于加载器说的规范,说明Modules如何被插入到代码运行状态中。加载器的规范是由 WHATWG 定义的, 但尚未完全确定。

The WHATWG Loader spec needs to define the following items for Milestone 0 on its roadmap:

+ Name resolution (relative and absolute URLs and paths)
+ Fetch integration
+ How to describe script tag: `<script type="module">`
+ Memoization / caching

WHATWG Loader 的规范需要定义以下的项目：

+ 文件名解决方案 （相对路径和绝对路径之类）
+ 获取并整合文件
+ 如何描述script标签 `<script type="module">`
+ 记忆化/缓存

The Module script tag has been defined, but the other items are still under discussion. You can check the status of this discussion on GitHub. Some browsers have started implementation, but most are waiting for finalization of the Loader spec.

模块化script标签被定义了，但是其他的项目还在讨论当中。 你可以在GitHub上看到当前讨论的进展。有些浏览器已经开始对它进行实现了，但是大部分还在等待Loader的规范。


## Why does Node.js need ES Modules?
When Node.js came into existence, an ES Modules proposal didn't exist. Node.js decided to use CommonJS Modules. While CommonJS as an organization is no longer an active concern, Node.js and npm have evolved the specification to create a very large JavaScript ecosystem. Browserify and more recently webpack bring Node's version of CommonJS to the browser and solve module problems gracefully. As a result, the Node/npm JavaScript module ecosystem spans both server and client and is growing rapidly.

## 为啥Node.js需要ES Modules?
当时Node.js出现的时候，ES Modules的提案还不存在。node.js和npm慢慢演变成越来越大的生态系统。Browserify和更晚的webpack 给浏览器带来了Node.js式的CommonJS规范，优雅的解决了模块块化的问题。因此 Node/npm 的javascript模块生态系统跨越服务器和客户端，并且迅速发展。


But how do we deal with interoperability between standard ES Modules and CommonJS-style modules in such a big ecosystem? This question has been debated heavily since the beginning of the ES Modules spec process.

但是我们如何在一个巨大的生态系统中同时处理标准 ES Modules 和 CommonJS 风格的模块呢的互用性呢? 这个问题在ES Modules 规范产生以来就被大量争论。


Browserify and webpack currently bridge the gap between browser and server to make JavaScript development easy and somewhat unified. If we lose interoperability, we increase the friction between the existing ecosystem and new standard. If front-end developers choose ES Modules as their preferred default and server-side engineers continue to use Node's CommonJS, the gap will only widen.


Browserify and webpack 目前在浏览器端和服务器端之前做了一个契合，让JavaScript的开发可以变得轻松且具有统一性。如果我们丢掉了互用性，会增加一些现有的生态的和新标准之间的冲突。
如果前端开发人员选择了ES Modules作为主要开发模式，而服务端工程师依然采用Node.js的CommonJS规范,那么这个冲突只会更大。




## An interoperability proposal for Node.js
Bradley Farias (a.k.a Bradley Meck) has written a proposal for interoperability between CommonJS and ES Modules. The proposal is presented in the form of a Node.js EP (Enhancement Proposal) and the pull request generated record amounts of discussion but also helped shape and tune the proposal. The EP was merged but still retains DRAFT status, indicating a preference rather than a clear intention to even implement ES Modules in Node.js. You can read the proposal here: https://github.com/nodejs/node-eps/blob/master/002-es-modules.md

Bradley Farias 写了一个关于 CommonJS 和 ES Modules 互用性的提案。这个提案在 Node.js EP (改善性提案) 组织中有被介绍，pr记录数量的讨论, 但也帮助形成和调整的建议。EP 结合了他们的想法，但是依然将其保持在草案阶段，他们表明自己的偏好，而不是一个明确的意图。你可以在下面网站中看到这个提案。
https://github.com/nodejs/node-eps/blob/master/002-es-modules.md


Discussion and options explored during the development of this proposal are mostly found throughout the initial pull request comments thread but a partial summary can be found on the Node.js wiki.
开发者之间关于这个提案的讨论和选择探究大部分都可以在最初的PR的评论中看到，，但是在Node.js的wiki上只有很少一部分。


The biggest challenge for Node.js is that it doesn't have the luxury of a `<script type="module">`
tag to tell it whether any given file is in CommonJS format or an ES Module. Unfortunately you can't even be sure in all cases what type of file you have simply by parsing it as the Modules spec presents us with some ambiguities in the distinction. It's clear that we need some signal that Node.js can use to determine whether to load a file as CommonJS (a "Script") or as an ES Module.

Node.js的最大的一个挑战是没有`<script type="module">`去告诉你这个模块到底是CommonJS格式还是ES Module。不幸的是，你甚至不能确定在各种情况下,你要要解析的文件在不清楚的Modules标准下他到底应该是什么样的类型。非常清楚的一点是，我们需要一些信号去让Node.js确定到底要加载一个CommonJS模块还是一个ES Module。


Some constraints that were applied in the decision making process include:

我们强制做的一些限制包括：

+ Avoiding a "boilerplate tax" (e.g. "use module")
+ Avoiding double-parsing if possible as Modules and Scripts parse differently
+ Don't make it too difficult for non-JavaScript tools to make the determination (e.g. build toolchains such as Sprockets or Bash scripts)
+ Don't impose a noticeable performance cost on users (e.g. by double-parsing large files)
+ No ambiguity
+ Preferably self-contained
+ Preferably without vestiges in a future where ES Modules may be the most prominent type

Clearly compromise has to be made somewhere to find a path forward as some of these constraints are in conflict when considering the options available.

+ 避免去使用模板语法。例如 "use module"
+ 避免脚本解析和模块解析规则不一,造成双重解析。
+ 能在无工具情况下工作。
+ 不要让用户有明显的性能损情况
+ 不要有歧义
+ 最好能独立工作
+ 在以后ES Module成为主流的时候，最好不要有历史遗留问题

显然, 必须在某处找到一条前进的道路, 因为这些限制因素 在考虑可供选择的方案时有存在冲突。  


The route chosen for the Node.js EP, and currently accepted by the Node.js CTC for ES Modules is detection via filename extension, .mjs (alternatives such as .es, .jsm were ruled out for various reasons).

目前被Node.js CTC接受的一个方案是通过文件扩展名 `.mjs` 。


Detection via filename extension provides a simple route to determining the intended contents of a JavaScript file: if a file's extension is .mjs then the file will load as an ES Module, but .js files will be loaded as a Script via CommonJS.

通过文件扩展名检测提供了一个简单的方式去确定一个JavaScript的文件的想要的加载方式。
如果文件扩展名是`.mjs`就按照 ES Module 的方式加载，`.js`的文件将会按照CommonJS的方式加载。    

## Basic interoperability algorithm
## 标准通用性算法
The following algorithm describes how interoperability between ES Modules and CommonJS can be achieved:  
![算法描述](https://raw.githubusercontent.com/yosuke-furukawa/esmodules_on_node/master/images/output.png)


For example, if a developer wanted to create a module that exports both module types (CommonJS and ES Modules) for backward compatibility, their package.json may be defined as:

举个例子 如果一个开发者创建了一个模块，需要同时兼容CommonJS和ES Module，他们的package.json需要显示成如下
```
{
  "name": "test",
  "version": "0.0.1",
  "description": "",
  "main": "./index",    // no file extension
}
```


The package will then have both an index.mjs and an index.js. The index.mjs is an ES Module, using the new export / import syntax:

这个包就需要同时存在index.mjs和index.js。`index.mjs` 是ES6的模块，使用了新的 export /import 语法;
```
// index.mjs
export default class Foo {
  //..
}
```

And the index.js is a CommonJS style module, using the module.exports object:  
index.js 是CommonJS 风格的模块。使用module.exports对象
```
// index.js
class Foo {
  // ...
}
module.exports = Foo;
```

If the version of Node.js being used supports ES Modules via the .mjs file extension, it will first try to find an index.mjs. On the other hand, if the version of Node.js does not support ES Modules (such as Node.js v4 or v6), or it can not find an index.mjs, it will look for an index.js.

如果node.js的版本支持 ES Modules,它会先试图寻找index.mjs。
如果node.js版本不支持 ES Modules,它不会寻找index.mjs。直接去找index.js。

According to the EP, you would be able to use both require and import to find packages in your node_modules:

根据EP，你可以同时使用require 和 import 去寻找模块。

```
import mkdirp from 'mkdirp';
require('mkdirp');
```

For resolving modules local to your own project or package, you do not need to add a file extensions in your require() or import statements unless you want to be precise. The standard Node.js file resolution algorithm applies when you don't supply an extension, but an .mjs version is looked for before a .js:

为了解决资源定位问题，你没必要在你的require或import引用后面添加文件扩展名，除非你要精确的定位。标准node.js文件解析算法允许你不提供扩展名，但是要注意，.mjs文件的查找优先级是高于.js的。
```
require('./foo');
import './foo';
// these both look at
//   ./foo.mjs
//   ./foo.js
//   ./foo/index.mjs
//   ./foo/index.js

// to explicitly load a CJS module, add '.js':
import './foo.js';
// to explicitly load an ES module add '.mjs'
import './bar.mjs';
```



## Examples: Consuming CommonJS with ES Modules
## 例子：用ES Modules 解析 CommonJS。
### Example 1: Load CommonJS from ES Modules
### 例子1:在ES Modules里加载CommonJS
```
// cjs.js
module.exports = {
  default:'my-default',
  thing:'stuff'
};
```

```
// es.mjs

import * as baz from './cjs.js';
// baz = {
//   get default() {return module.exports;},
//   get thing() {return this.default.thing}.bind(baz)
// }
// console.log(baz.default.default); // my-default

import foo from './cjs.js';
// foo = {default:'my-default', thing:'stuff'};

import {default as bar} from './cjs.js';
// bar = {default:'my-default', thing:'stuff'};
```

### Example 2: Export value and assigning "default"
### 例子2： 输出值和使用default
```
// cjs.js
module.exports = null;
```

```
// es.mjs
import foo from './cjs.js';
// foo = null;

import * as bar from './cjs.js';
// bar = {default:null};
```

### Example 3: Single-function export
### 例子3：单函数输出
```
// cjs.js
module.exports = function two() {
  return 2;
};
```

```
// es.mjs
import foo from './cjs.js';
foo(); // 2

import * as bar from './cjs.js';
bar.name; // 'two' ( get function name)
bar.default(); // 2 ( assigned default function )
bar(); // throws, bar is not a function
```

## Examples: Consuming ES Modules with CommonJS
## 例子：在CommonJS里面处理ES Modules
### Example 1: Using export default
### 例子1：使用export default;

```
// es.mjs
let foo = {bar:'my-default'};
export default foo;
foo = null; // this null value does not effect import value.
```

```
// cjs.js
const es_namespace = require('./es');
// es_namespace ~= {
//   get default() {
//     return result_from_evaluating_foo;
//   }
// }
console.log(es_namespace.default);
// {bar:'my-default'}
```

### Example 2: Using export
```
// es.mjs
export let foo = {bar:'my-default'};
export {foo as bar};
export function f() {};
export class c {};
```


```
// cjs.js
const es_namespace = require('./es');
// es_namespace ~= {
//   get foo() {return foo;}
//   get bar() {return foo;}
//   get f() {return f;}
//   get c() {return c;}
// }

```


## Current state of discussion
## 
Although built in a collaborative process, taking into account proposals for alternatives, Bradley's landed EP received a prominent counter-proposal from outside of the EP process. Going by the name "In Defense of .js", this counter-proposal relies on the use of package.json rather than a new file extension. Even though this option had been previously discussed, this new proposal contains some interesting additions.
虽然建立在一个合作的过程中，考虑到替代方案的建议， Bradley's收到了一个EP流程之外的反对提案，`In Defense of .js`。（大意为要保护.js扩展名）。
这个反对提案依赖package.json去维护模块类型，而不是使用一个新的文件扩展名，尽管他们先前讨论过类似的做法，但是这个新提案包含了一些有意思的补充。

In Defense of .js presents the following rules for determining what format to load a file, with the same rules for both require and import:

在`Defense of .js`里提出了以下的一些规则，来判定加载的文件是什么类型的，这些规则同时适用 require 和import。

+ If package.json has "main" field but not a "module" field, all files in that package are loaded as CommonJS.
+ If a package.json has a "module" field but not "main" field, all files in that package are loaded as ES Modules.
If a package.json has neither "main" nor "module" fields, it will depend on on whether an index.js or a module.js exists in the package as to whether to load files in the package as CommonJS or ES Modules respectively.
+ If a package.json has both "main" and "module" fields, files in the package will be loaded as CommonJS unless they are enumerated in the "module" field in which case they will be loaded as ES Modules, this may also include directories.
+ If there is no package.json in place (e.g. require('c:/foo')), it will default to being loaded as CommonJS.
+ A special "modules.root" field in package.json, files under the directory specified will be loaded as ES Modules. Additionally, files loaded relative to the package itself (e.g. require('lodash/array')) will load from within this directory.

+ 如果`package.json`有`main`字段，但是没有`module`字段，则所有的文件都按照CommonJS的方式加载。

+ 如果`package.json`有`module`字段，但是没有`main`字段，则所有的文件都按照ES Module的方式加载。

+ 如果`package.json`既没有`main`，也没有`module`字段，则根据你的包里面有`index.js`还是`modules.js`，去分别加载不同的模块类型。

+ 如果`package.json`两者都有，则一般文件按照CommonJS的方式加载,在 `module`字段内能被枚举到的文件或者文件夹里面的包按照ES Module方式加载。

+ 如果没有`package.json`，则使用CommonJS方式加载。

+ 如果`package.json`有一个特殊的字段`modules.root`,指定目录下的文件则会按照ES Module方式加载。



## In Defense of .js Examples
```
// package.json
// all files loaded as CommonJS
{
  "main": "index.js" // default module for package
}
```

```
// package.json
// default to CommonJS, conditional loading of ES Modules
{
  "main": "index.js", // used by older versions of Node.js as default module, CommonJS
  "module": "module.js" // used by newer versions of Node.js as default module, ES Module
}
```

```
// package.json
// CommonJS with directory exceptions
{
  "main": "index.js",
  "module": "module.js",
  "modules.root": "lib" // all files loaded within this directory will be ES Modules
}
```

The above example is used to show how to maintain backward compatibility for packages. For older versions of Node.js, require('foo/bar') will look for a CommonJS bar.js in the root of the package. However, for newer versions of Node.js, the "modules.root": "lib" directory will dictate that loading 'foo/bar' will look for an ES Module at lib/bar.js.

上面的这些例子展示了如何取维护包的向后兼容，对于老版本的Node.js，
`require('foo/bar')`去根目录寻找CommonJS模块的bar.js。
然而 对于新版的Node.js `"modules.root": "lib"` 会使用 ES Modue 加载 `lib/bar.js`。


## Hard choices
## 艰难的选择
In Defense of .js presents a view that we need to switch to ES Modules from CommonJS and prioritizes such a future. On the other hand, the Node.js EP prioritizes compatibility and interoperability.
`In Defense of .js`提出的观点是,我们需要手动从CommonJS 切换到ES Modules，并且优先考虑未来流行的ES Module。
另外一方面，Node.js EP优先考虑兼容性和互用性。


Bradley recently wrote a post attempting to further explain the difficult choice and why a file extension was an appropriate way forward. In it, he goes into further details about why it is not possible to parse a file to determine whether it is an ES Module or not. He also further explores the difficulties of having an out-of-band descriptor (e.g. package.json) determine what type of content is in a .js file.

Bradley 最近写了一篇帖子试图去更深刻的解释这个艰难的选择，为什么使用新的文件扩展名是一个合适的方式。在文章中，他深入的解释了为什么在不能解析一个文件的时候确定它到底是不是ES Module，他也深入探索了用一个外部的描述去维护模块类型的复杂性。

Although it may be sad to consider the loss of a universal .js file extension, it's worth noting that other languages have already paved this path. Perl for instance uses .pl for Perl Script, and .pm for Perl Module.

虽然可能会有一点伤心的地方是我们失去了通用的 `.js`的扩展名，值得注意的是，其他的语言也采用了这种方式去处理。比如 Perl脚本的实例用的是`.pl`但是 Perl Module使用的是`.pm`。


## Getting involved
## 参与进来
即使Node.js CTC已经接受了目前的EP形式，并且表示了如何在Node.js中实现ES模块（如果它们完全在Node.js中实现），那么讨论仍在继续，而且还有空间 为了改变。 您可以参与Node.js EP存储库问题列表中的Node.js社区。 请务必先查看现有意见，看看您的疑虑是否已经解决。

虽然 Node.js CTC接受了 EP 

Bradley and the Node.js CTC are very concerned about getting this decision right, in the interests of Node.js users everywhere. The choices that Node.js is having to make to accommodate ES Modules are difficult and are not being approached lightly.

Bradley和Node.js CTC非常关心为了Node.js用户的利益而做出正确的决定。 Node.js为了适应ES模块而做出的选择是困难的，并且不会被轻易达到。
