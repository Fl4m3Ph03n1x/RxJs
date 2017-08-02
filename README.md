# Description

Microservice for barcode readers. Contains a server that collects the data from a barcode reader and the
dispatches it to interested parties.

## Events

 - ${NAME}.onRead: when the server receives a code from a barcode machine. The arguments are the name of the machine and the code in ascii format.


# Deploy

These instructions assume you already have the following installed and setup:

1. Crossbar.io
2. Node.js
3. npm

To deploy the server:

1. Download and unzip project
2. npm install
3. Check `conf.json` for correct parameters
4. run `crossbar init`
5. run `crossbar start`
6. run `npm test` to see if everything is ok
7. run `npm start` (the sever is running)
8. (optional) If you want a client to play with the server a sample one is provided. Run `npm run client`.

An example application to launch the server is in `app.js`.
