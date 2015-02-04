Tokyo Amesh Chrome App
==========================

Unofficial [Tokyo Amesh](http://tokyo-ame.jwa.or.jp/) Chrome App.

https://chrome.google.com/webstore/detail/tokyo-ame/cmidngbgkimeejhcdnggnnlnkjhhjkkp?hl=ja

## Development

### Requirements

* Bower
* Grunt
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
