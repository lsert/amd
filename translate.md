ECMAScript 2015 (ES2015, formerly ES6) was published almost a year ago. Node.js v6 supports 93% of the ES2015 syntax and features and most modern browsers exceed 90%. However, no JavaScript runtime currently supports ES Modules. (Note that kangax's compatibility table does not yet have an ES Modules column.)

ECMAScript 2015(ES2015,曾经叫 ES6) 已经推出了快一年了。Nodejs v6 支持了 ES2015 93%的语法和特性，大部分的现代浏览器也支持超过90%。然鹅，当前没有任何JavaScript引擎支持ES Modules。

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

我们强制做的一些限制包括：

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
The following algorithm describes how interoperability between ES Modules and CommonJS can be achieved:
