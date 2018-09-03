const express = require('express');
const bodyParser = require('body-parser');
const assert = require('chai').assert;
const cors = require('cors');
const fs = require('fs');

const cwd = process.cwd();
const monckFilesDir = `${cwd}/monck/files`;

class Server {
    constructor() {
        this.app = express();
    }

    connect(port = 8001) {
        this.app.listen(port, () => {
            console.log(`Monck is running on port ${port}`);
        });
    }

    setApis(apis) {
        const router = express.Router();
        apis.forEach((api) => {
            const middlewares = [];
            if(api.cors) middlewares.push(cors(api.cors));
            router[api.method](api.path, middlewares, (req, res, next) => {
                this.handle(api.cases, req, res, next);
            });
        });

        // parse application/x-www-form-urlencoded
        this.app.use(bodyParser.urlencoded({ extended: false }));
        // parse application/json
        this.app.use(bodyParser.json());
        this.app.use(router);
        // Didn't match any route
        this.app.use(this.notFound.bind(this));
    }

    notFound(req, res, next) {
        res.status(404).send('The request has not match with any route in Monck');
    }

    handle(cases, req, res, next) {
        const inputNames = ['query', 'params', 'headers', 'body'];
        for (let caseIndex in cases) {
            const currentCase = cases[caseIndex];
            let hasMatched = false;
            for (let inputName in currentCase) {
                if (inputNames.includes(inputName)) {
                    const input = req[inputName];
                    const expectedInput = currentCase[inputName];
                    hasMatched = this.check(input, expectedInput);
                    if (!hasMatched) break;
                }
            }

            if (hasMatched) {
                const { then } = currentCase;
                let body = '';

                if(then.body.indexOf('$file:') === 0){
                    const parts = then.body.split(':');
                    const fileName = parts.splice(1).join(':');
                    const filePath = `${monckFilesDir}/${fileName}`;
                    body = fs.readFileSync(filePath, 'utf8');
                }else{
                    body = then.body;
                }
                
                res.status(then.status).set(then.headers).send(body);
                // Print
                return true;
            }
        };

        next();
    }

    check(input, expected) {
        let currentExpected;
        for (let property in expected) {
            if (!(property in input)) return false;
            currentExpected = expected[property];
            // Each field
            for (let method in currentExpected) {
                // Each rule
                try {
                    // Good to go
                    assert[method](input[property], currentExpected[method]);
                } catch (e) {
                    return false;
                }
            }
        }

        return true;
    }
}

const server = new Server();

module.exports = server;