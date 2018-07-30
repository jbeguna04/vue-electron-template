const { spawn } = require('child_process')
/* eslint-disable*/
const Bundler = require('parcel-bundler')
const electron = require('electron')
/* eslint-enable */
const Path = require('path')

let electronProcess = null

async function log(data) {
  let log = ''
  data = data.toString().split(/\r?\n/)
  data.forEach(line => {
    log += `${line}`
  })
  console.info(log)
}

async function startElectron() {
  electronProcess = spawn(electron, [
    '--inspect=5858',
    Path.join(__dirname, './dist/main.js')
  ])

  electronProcess.stdout.on('data', data => {
    log(data)
  })

  electronProcess.stderr.on('data', data => {
    log(data)
  })

  electronProcess.on('close', () => {
    process.exit()
    electronProcess = null
  })
}

async function runMainBundle() {
  // Entrypoint file location
  const file = Path.join(__dirname, './src/main/index.js')

  // Bundler options
  const options = {
    outDir: './dist', // The out directory to put the build files in, defaults to dist
    outFile: 'main.js', // The name of the outputFile
    watch: true, // whether to watch the files and rebuild them on change, defaults to process.env.NODE_ENV !== 'production'
    minify: false, // Minify files, enabled if process.env.NODE_ENV === 'production'
    target: 'node', // browser/node/electron, defaults to browser
    sourceMaps: false // Enable or disable sourcemaps, defaults to enabled (not supported in minified builds yet)
  }

  // Initializes a bundler using the entrypoint location and options provided
  const bundler = new Bundler(file, options)

  bundler.on('bundled', bundle => {
    // startElectron()
  })

  bundler.on('buildEnd', () => {
    if (electronProcess && electronProcess.kill) {
      // process.kill(electronProcess.pid)
    }

    startElectron()
  })

  bundler.on('buildError', error => {
    console.log(error)
  })

  // Run the bundler, this returns the main bundle
  // Use the events if you're using watch mode as this promise will only trigger once and not for every rebuild
  bundler.bundle()
}

async function runRendererBundle() {
  const file = Path.join(__dirname, './src/renderer/index.html')

  // Bundler options
  const options = {
    outDir: './dist', // The out directory to put the build files in, defaults to dist
    outFile: 'index.html', // The name of the outputFile
    watch: true, // whether to watch the files and rebuild them on change, defaults to process.env.NODE_ENV !== 'production'
    minify: false, // Minify files, enabled if process.env.NODE_ENV === 'production'
    target: 'electron', // browser/node/electron, defaults to browser
    sourceMaps: false // Enable or disable sourcemaps, defaults to enabled (not supported in minified builds yet)
  }

  // Initializes a bundler using the entrypoint location and options provided
  const bundler = new Bundler(file, options)

  bundler.on('bundled', bundle => {
    // startElectron()
  })

  bundler.on('buildEnd', () => {
    if (electronProcess && electronProcess.kill) {
      process.kill(electronProcess.pid)
    }

    startElectron()
  })

  bundler.on('buildError', error => {
    console.log(error)
  })

  // Run the bundler, this returns the main bundle
  // Use the events if you're using watch mode as this promise will only trigger once and not for every rebuild
  bundler.bundle()
}

Promise.all([runMainBundle(), runRendererBundle()]).then(() => {
  startElectron()
})
