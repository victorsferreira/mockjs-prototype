const express = require('express');
const bodyParser = require('body-parser');
const assert = require('chai').assert;
const cors = require('cors');

class Server {
    constructor() {
        this.app = express();
    }

    connect(port = 8001) {
        this.app.listen(port, () => {
            console.log(`Mockjs running on port ${port}`);
        });
    }

    setApis(apis) {
        const router = express.Router();
        let routes = [];
        let route, apiCase;

        apis.forEach((api) => {
            apiCase = api.case;

            apiCase.forEach((currentCase) => {
                                
            });

            route = {
                method: api.method,
                path: api.path,                
            };

            route = Object.assign({},route, api.case);

            routes = routes.concat();
        });

        routes.forEach((route) => {
            router[route.method](route.path, (req, res, next) => {
                this.handle(route, req, res, next);
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
        res.status(404).send('The request has not match with any route in Mockjs');
    }

    handle(route, req, res, next) {
        const {
            query,
            params,
            headers,
            body
        } = req;

        const input = {
            query,
            params,
            headers,
            body
        };

        const { request, response } = route;

        let hasMatched = false;
        ['query', 'params', 'headers', 'body'].some((key) => {
            // If any returns false, it exits the loop
            if (key in request) {
                hasMatched = this.check(input[key], request[key]);
                return !hasMatched;
            }
        });

        if (hasMatched) {
            res.status(response.status).set(response.headers).send(response.body);
        } else {
            next();
        }
    }

    check(input, expected) {
        let currentExpected;
        for (let property in expected) {
            if(!(property in input)) return false;
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

module.exports = new Server();