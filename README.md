# ItemizeJS
> Turn any container's children into manageable items.

[![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Downloads Stats][npm-downloads]][npm-url]

ItemizeJS is a Javascript library which transforms any container’s children into manageable items in just two lines of code.

Items will reorganize themselves with a nice animation when removed or added.

![](header.png)

# Installation

### Include script
CDN:
```html
<script src="//cdn.jsdelivr.net/npm/itemizejs@1.11.4/build/itemize.min.js"></script>
```
Locally:
```html
<script src="YOURPATH/itemize.min.js"></script>
```
### OR install with NPM
```
npm install itemizejs
```
```javascript
import Itemize from itemizejs
```

### Start coding!
```javascript
var itemManager = new Itemize();
itemManager.apply(".target_container");
```

# Usage example

A few examples: https://itemize.js/index.html?example


## Meta

Kosmoon – [@YourTwitter](https://twitter.com/kosmoon) – kosmoonstudio@gmail.com

Distributed under the MIT license. [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[https://github.com/Kosmoon/itemizejs](https://github.com/Kosmoon/itemizejs)

## Contributing

1. Fork it (<https://github.com/Kosmoon/itemizejs/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request

<!-- Markdown link & img dfn's -->
[npm-image]: https://img.shields.io/npm/v/datadog-metrics.svg?style=flat-square
[npm-url]: https://npmjs.org/package/datadog-metrics
[npm-downloads]: https://img.shields.io/npm/dm/datadog-metrics.svg?style=flat-square
[travis-image]: https://img.shields.io/travis/dbader/node-datadog-metrics/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/dbader/node-datadog-metrics
[wiki]: https://github.com/yourname/yourproject/wiki
