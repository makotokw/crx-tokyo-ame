Tokyo Amesh for Chrome Extension
==========================

Unofficial [Tokyo Amesh](http://tokyo-ame.jwa.or.jp/) Chrome Extension.

## Development

### Requirements

* Grunt
* Bower
* Compass >=1.0.1

### Getting Started

```
npm install
bower install
grunt debug
```

Add ``background`` to ``app/manifest.json`` for LiveReload.

```
    "background": {
        "scripts": [
            "scripts/chromereload.js",
            "scripts/background.js"
        ]
    },
```

Open Chrome and go to Tools > Extensions > ``Load unpacked extensions...`` and select ``app`` directory.


## LICENSE

The MIT License (MIT)  
See also LICENSE file
