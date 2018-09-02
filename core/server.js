const express = require('express');
const bodyParser = require('body-parser');
const assert = require('assert').asert;
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

    setRoutes(routes) {
        const router = express.Router();

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
        ['query', 'params', 'headers', 'body'].forEach((key) => {
            if (key in request) {
                hasMatched = this.check(input[key], request[key]);
            }
        });

        if (hasMatched) {
            res.status(response.status).set(response.headers).send(response.body);
        } else {
            next();
        }
    }

    check(input, expected) {
        // expected exists in input?
        // try/catch expected
        for (var k in expected) {
            // Each field
            for (var kk in expected[k]) {
                // Each rule
                try {
                    assert[kk](input[k], expected[k][kk]);
                } catch (e) {

                }
            }
        }

        return true;
    }
}

module.exports = new Server();