# json-service-mocker
A client-side XHR mocker specifically for mocking JSON data from an API. It replaces the global XMLHttpRequest object with one provided by sinon's [nise](https://github.com/sinonjs/nise) tool.

# Requirements
This package uses Object.assign so that must be available either through a polyfill or supported browsers.

# Installation
```
npm install json-service-mocker
```

# Usage
To use inside of your project, import it like so:

```
///////////////////////////////////
/* --- Importing the library --- */
///////////////////////////////////

// Typescript
import { JSONServiceMocker } from 'json-service-mocker';

// ES6
const JSONServiceMocker = require('json-service-mocker').JSONServiceMocker;

//////////////////////////////////////////
/* --- Initializing mocking service --- */
//////////////////////////////////////////

const services = [
    {...},
    {
        'method': 'GET',
        'path': '/get/json',
        'status': 200,
        'body': {
            'item': {
                'name': 'me',
                'age': 2
            },
            'secondItem': {
                'name': 'me'
            }
        },
        'timeout': '',
        'header': ''
    },
    {...}
];

const mocker = new JSONServiceMocker();
mocker.init(services);
```

