const { spawn } = require('child_process')
/* eslint-disable*/
const Bundler = require('parcel-bundler')
const electron = require('electron')
/* eslint-enable */
const Path = require('path')

let electronProcess = null

async function startElectron() {
  electronProcess = spawn(electron, [
    '--inspect=5858',
    Path.join(__dirname, './dist/main.js'),
  ])

  electronProcess.stdout.on('data', data => {
    console.log(data.toString())
  })

  electronProcess.stderr.on('data', data => {
    console.error(data.toString())
  })

  electronProcess.on('close', () => {})
}

async function runRendererBundle() {
  const file = Path.join(__dirname, './src/renderer/index.html')

  // Bundler options
  const options = {
    minify: false,
    outDir: './dist',
    outFile: 'index.html',
    port: 1234,
    sourceMaps: false,
    target: 'electron',
  }

  const bundler = new Bundler(file, options)

  return new Promise((resolve, reject) => {
    bundler.on('bundled', bundle => {
      resolve()
    })

    bundler.on('buildError', error => {
      reject()
    })

    bundler.serve()
  })
}

async function runMainBundle() {
  // Entrypoint file location
  const file = Path.join(__dirname, './src/main/index.js')

  // Bundler options
  const options = {
    minify: false,
    outDir: './dist',
    outFile: 'main.js',
    sourceMaps: false,
    target: 'node',
    watch: true,
  }

  // Initializes a bundler using the entrypoint location and options provided
  const bundler = new Bundler(file, options)

  bundler.on('buildEnd', () => {
    if (electronProcess && electronProcess.kill) {
      process.kill(electronProcess.pid)
    }

    startElectron()
  })

  bundler.on('buildError', error => {
    console.log(error)
  })

  bundler.bundle()
}

// start bundles
runRendererBundle()
  .then(() => {
    runMainBundle()
  })
  .catch(err => {
    console.error(err)
  })
