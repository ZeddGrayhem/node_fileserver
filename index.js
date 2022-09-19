const express = require('express');
const yargs = require('yargs');
const app = express();

const argv = yargs
  .option('port', {
    alias: 'p',
    description: 'The port to listen on',
    type: 'number'
  })
  .option('directory', {
    alias: 'd',
    description: 'Directory to make public',
    type: 'string'
  })
  .help()
  .alias('help', 'h').argv;

const port = (argv.port <= 65535 && argv.port > 0)  ? argv.port : 4000
const path = (argv.directory && require('fs').lstatSync(argv.directory).isDirectory())
    ? argv.directory
    : require('path').join(__dirname, 'public')


app.use((req, res, next) => {
    console.log(req.connection.remoteAddress.split(':')[3], req.originalUrl)
    next()
})

app.use('/download', express.static(path))

app.get('/', (req, res) => res.send('=> Connection succesful'))

app.listen(port, () => {
    console.log(`Started sharing files on port ${port}`)
    console.log(path)
    require('fs').readdirSync(path).forEach(item => console.log(`   ${item}`))
})