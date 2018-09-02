const server = require('./core/server');
const cwd = process.cwd();

module.exports = {
    start: (options) => {
        const { routes, port } = options;

        server.connect(port);
        server.setRoutes(routes);
    }
};