require('./config.js')
let { WAConnection: _WAConnection } = require('@adiwajshing/baileys')
let { generate } = require('qrcode-terminal')
let syntaxerror = require('syntax-error')
let simple = require('./lib/simple')
//  let logs = require('./lib/logs')
let { promisify } = require('util')
let yargs = require('yargs/yargs')
let Readline = require('readline')
let cp = require('child_process')
let path = require('path')
let fs = require('fs')

let rl = Readline.createInterface(process.stdin, process.stdout)
let WAConnection = simple.WAConnection(_WAConnection)

//global.owner = Object.keys(global.Owner)
global.API = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({ ...query, ...(apikeyqueryname ? { [apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name] } : {}) })) : '')
global.timestamp = {
  start: new Date
}
// global.LOGGER = logs()
const PORT = process.env.PORT || 3000
global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())

global.prefix = new RegExp('^[' + (opts['prefix'] || '‎xzXZ/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.\\-HhhHBb.*aA').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']')

global.DATABASE = new (require('./lib/database'))(`${opts._[0] ? opts._[0] + '_' : ''}database.json`, null, 2)
if (!global.DATABASE.data.users) global.DATABASE.data = {
  users: {},
  chats: {},
  stats: {},
  msgs: {},
  sticker: {},
}
if (!global.DATABASE.data.chats) global.DATABASE.data.chats = {}
if (!global.DATABASE.data.stats) global.DATABASE.data.stats = {}
if (!global.DATABASE.data.msgs) global.DATABASE.data.msgs = {}
if (!global.DATABASE.data.sticker) global.DATABASE.data.sticker = {}
global.conn = new WAConnection()
let authFile = `${opts._[0] || 'session'}.data.json`
if (fs.existsSync(authFile)) conn.loadAuthInfo(authFile)
if (opts['trace']) conn.logger.level = 'trace'
if (opts['debug']) conn.logger.level = 'debug'
if (opts['big-qr'] || opts['server']) conn.on('qr', qr => generate(qr, { small: false }))
let lastJSON = JSON.stringify(global.DATABASE.data)
//if (!opts['test']) setInterval(() => {
//  conn.logger.info('Saving database . . .')
//  if (JSON.stringify(global.DATABASE.data) == lastJSON) conn.logger.info('Database is up to date')
//  else {
//    global.DATABASE.save()
//    conn.logger.info('Done saving database!')
//    lastJSON = JSON.stringify(global.DATABASE.data)
//  }
//}, 60 * 1000) // Save every minute
//if (opts['server']) require('./server')(global.conn, PORT)

conn.version = [2, 2143, 3]
conn.connectOptions.maxQueryResponseTime = 60_000
if (opts['test']) {
  conn.user = {
    jid: '2219191@s.whatsapp.net',
    name: 'test',
    phone: {}
  }
  conn.prepareMessageMedia = (buffer, mediaType, options = {}) => {
    return {
      [mediaType]: {
        url: '',
        mediaKey: '',
        mimetype: options.mimetype || '',
        fileEncSha256: '',
        fileSha256: '',
        fileLength: buffer.length,
        seconds: options.duration,
        fileName: options.filename || 'file',
        gifPlayback: options.mimetype == 'image/gif' || undefined,
        caption: options.caption,
        ptt: options.ptt
      }
    }
  }

  conn.sendMessage = async (chatId, content, type, opts = {}) => {
    let message = await conn.prepareMessageContent(content, type, opts)
    let waMessage = await conn.prepareMessageFromContent(chatId, message, opts)
    if (type == 'conversation') waMessage.key.id = require('crypto').randomBytes(16).toString('hex').toUpperCase()
    conn.emit('chat-update', {
      jid: conn.user.jid,
      hasNewMessage: true,
      count: 1,
      messages: {
        all() {
          return [waMessage]
        }
      }
    })
  }
  rl.on('line', line => conn.sendMessage('123@s.whatsapp.net', line.trim(), 'conversation'))
} else {
  rl.on('line', line => {
    global.DATABASE.save()
    process.send(line.trim())
  })
  conn.connect().then(() => {
    fs.writeFileSync(authFile, JSON.stringify(conn.base64EncodedAuthInfo(), null, '\t'))
    global.timestamp.connect = new Date
  })
}
process.on('uncaughtException', console.error)
// let strQuot = /(["'])(?:(?=(\\?))\2.)*?\1/

let isInit = true
global.reloadHandler = function () {
  let handler = require('./handler')
  if (!isInit) {
    conn.off('chat-update', conn.handler)
    conn.off('message-delete', conn.onDelete)
    conn.off('group-participants-update', conn.onParticipantsUpdate)
    conn.off('CB:action,,call', conn.onCall)
  }
  conn.welcome = `
╭━━━━━✯𓆩ֶ፝֟𓆪⁩✯━━━━━╮
├⇶❖⛩𝗛𝗢𝗟𝗔 @user⛩❖
├⇶╭─➤͜͡❍͜͡➣𝐁𝐈𝐄𝐍𝐕𝐄𝐍𝐈𝐃
├⇶╰➤͜͡❍͜͡➣𝐀𝐋 𝐆𝐑𝐔𝐏𝐎🙌💖
├━━━━≪✯𓆩ֶ፝֟𓆪⁩✯≫━━━╯
├⇶@subject 
├⇶𝐄𝐧 𝐞𝐬𝐭𝐞 𝐠𝐫𝐮𝐩𝐨 𝐀𝐦𝐢𝐬𝐭𝐚𝐝𝐞𝐬🎭
├⇶𝐏𝐚𝐫𝐚 𝐯𝐞𝐫 𝐦𝐢𝐬 𝐜𝐨𝐦𝐚𝐧𝐝𝐨𝐬👩‍💻 
├⇶𝐩𝐨𝐧 #𝐦𝐞𝐧𝐮👥
├⇶𝐀𝐪𝐮í 𝐭𝐢𝐞𝐧𝐞𝐬 𝐥𝐚 𝐝𝐞𝐬𝐜𝐫𝐢𝐩𝐜𝐢ó𝐧👩‍🏫
╰━━━━━✯𓆩ֶ፝֟𓆪⁩✯━━━━━╯
╭━━━━━✯𓆩ֶ፝֟𓆪⁩✯━━━━━╮
@desc
╰━━━━━✯𓆩ֶ፝֟𓆪⁩✯━━━━━╯
╭━━━━━✯𓆩ֶ፝֟𓆪⁩✯━━━━━╮
├⇶╭─➤͜͡❍͜͡➣°𝐃𝐢𝐬𝐟𝐫𝐮𝐭𝐚 𝐭𝐮
├⇶𝐞𝐬𝐭𝐚𝐧𝐜𝐢𝐚 𝐞𝐧 𝐞𝐥 𝐠𝐫𝐮𝐩𝐨🌹🙌
├⇶╰➤͜͡❍͜͡➣𝐇𝐀𝐃𝐄𝐒_𝐁𝐎𝐓❍͜͡➣
╰━━━━━✯𓆩ֶ፝֟𓆪⁩✯━━━━━╯`
conn.bye = `
╭━━━━━✯𓆩ֶ፝֟𓆪⁩✯━━━━━╮
├⇶╭─➤͜͡❍͜͡➣ @user 
𝐒𝐚𝐥𝐢ó 𝐝𝐞𝐥 𝐠𝐫𝐮𝐩𝐨 𝐧𝐢 𝐦𝐨𝐝𝐨 𝐪𝐮𝐞 𝐭𝐞 𝐯𝐚𝐲𝐚 𝐛𝐢𝐞𝐧 𝐇𝐚𝐬𝐭𝐚 𝐥𝐚 𝐩𝐫ó𝐱𝐢𝐦𝐚 𝐪𝐮𝐞 𝐃𝐢𝐨𝐬 𝐭𝐞 𝐛𝐞𝐧𝐝𝐢𝐠𝐚 
├⇶╰➤͜͡❍͜͡➣𝐇𝐀𝐃𝐄𝐒_𝐁𝐎𝐓❍͜͡➣
╰━━━━━✯𓆩ֶ፝֟𓆪⁩✯━━━━━╯`
  conn.spromote = `
╭━━━━━✯𓆩ֶ፝֟𓆪⁩✯━━━━━╮
├⇶╭─➤͜͡❍͜͡➣ @user
💖🌹𝐇𝐨𝐥𝐚 𝐟𝐞𝐥𝐢𝐜𝐢𝐝𝐚𝐝𝐞𝐬🎊💫 𝐇𝐚 𝐡𝐨𝐫𝐚 𝐞𝐫𝐞𝐬 𝐚𝐝𝐦𝐢𝐧𝐢𝐬𝐭𝐫𝐚𝐝𝐨𝐫👩‍💻 𝐝𝐞𝐥 𝐠𝐫𝐮𝐩𝐨 𝐛𝐢𝐞𝐧 𝐡𝐞𝐜𝐡𝐨☺️ 𝐬𝐢𝐠𝐮𝐞 𝐚𝐬í 𝐠𝐫𝐚𝐜𝐢𝐚𝐬 𝐩𝐨𝐫 𝐭𝐮 𝐚𝐩𝐨𝐲𝐨🤝💖 𝐞𝐬𝐩𝐞𝐫𝐨 𝐪𝐮𝐞 𝐧𝐨𝐬 𝐬𝐢𝐠𝐚𝐬 𝐚𝐩𝐨𝐲𝐚𝐧𝐝𝐨💖🙌 
├⇶╰➤͜͡❍͜͡➣𝐇𝐀𝐃𝐄𝐒_𝐁𝐎𝐓❍͜͡➣°
╰━━━━━✯𓆩ֶ፝֟𓆪⁩✯━━━━━╯`
  conn.sdemote = `
╭━━━━━✯𓆩ֶ፝֟𓆪⁩✯━━━━━╮
├⇶╭─➤͜͡❍͜͡➣ @user
😢🥺𝐇𝐨𝐥𝐚 𝐥𝐨 𝐬𝐞𝐧𝐭𝐢𝐦𝐨𝐬 𝐩𝐞𝐫𝐨 𝐲𝐚 𝐧𝐨 𝐞𝐫𝐞𝐬 𝐚𝐝𝐦𝐢𝐧𝐢𝐬𝐭𝐫𝐚𝐝𝐨𝐫👩‍💻 𝐝𝐞𝐥 𝐠𝐫𝐮𝐩𝐨 é𝐬𝐨 𝐩𝐚𝐬𝐨 𝐩𝐨𝐫 𝐭𝐮 𝐟𝐚𝐥𝐭𝐚 𝐝𝐞 𝐚𝐩𝐨𝐲𝐨💹 𝐞𝐧 𝐥𝐞 𝐠𝐮𝐫𝐩𝐨 𝐞𝐬𝐩𝐞𝐫𝐨 𝐲 𝐧𝐨𝐬 𝐞𝐧𝐭𝐢𝐞𝐧𝐝𝐚𝐬 𝐠𝐫𝐚𝐜𝐢𝐚𝐬🙌☺️💖
├⇶╰➤͜͡❍͜͡➣𝐇𝐀𝐃𝐄𝐒_𝐁𝐎𝐓❍͜͡➣
╰━━━━━✯𓆩ֶ፝֟𓆪⁩✯━━━━━╯`
  conn.handler = handler.handler
  conn.onDelete = handler.delete
  conn.onParticipantsUpdate = handler.participantsUpdate
  conn.onCall = handler.onCall
  conn.on('chat-update', conn.handler)
  conn.on('message-delete', conn.onDelete)
  conn.on('group-participants-update', conn.onParticipantsUpdate)
  conn.on('CB:action,,call', conn.onCall)
  if (isInit) {
    conn.on('error', conn.logger.error)
    conn.on('close', () => {
      setTimeout(async () => {
        try {
          if (conn.state === 'close') {
            if (fs.existsSync(authFile)) await conn.loadAuthInfo(authFile)
            await conn.connect()
            fs.writeFileSync(authFile, JSON.stringify(conn.base64EncodedAuthInfo(), null, '\t'))
            global.timestamp.connect = new Date
          }
        } catch (e) {
          conn.logger.error(e)
        }
      }, 5000)
    })
  }
  isInit = false
  return true
}

// Plugin Loader
let pluginFolder = path.join(__dirname, 'plugins')
let pluginFilter = filename => /\.js$/.test(filename)
global.plugins = {}
for (let filename of fs.readdirSync(pluginFolder).filter(pluginFilter)) {
  try {
    global.plugins[filename] = require(path.join(pluginFolder, filename))
  } catch (e) {
    conn.logger.error(e)
    delete global.plugins[filename]
  }
}
console.log(Object.keys(global.plugins))
global.reload = (_event, filename) => {
  if (pluginFilter(filename)) {
    let dir = path.join(pluginFolder, filename)
    if (dir in require.cache) {
      delete require.cache[dir]
      if (fs.existsSync(dir)) conn.logger.info(`re - require plugin '${filename}'`)
      else {
        conn.logger.warn(`deleted plugin '${filename}'`)
        return delete global.plugins[filename]
      }
    } else conn.logger.info(`requiring new plugin '${filename}'`)
    let err = syntaxerror(fs.readFileSync(dir), fs.existsSync(dir) ? filename : 'Execution Function')
    if (err) conn.logger.error(`syntax error while loading '${filename}'\n${err}`)
    else try {
      global.plugins[filename] = require(dir)
    } catch (e) {
      conn.logger.error(e)
    } finally {
      global.plugins = Object.fromEntries(Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b)))
    }
  }
}
Object.freeze(global.reload)
fs.watch(path.join(__dirname, 'plugins'), global.reload)
global.reloadHandler()
process.on('exit', () => global.DATABASE.save())



// Quick Test
async function _quickTest() {
  let test = await Promise.all([
    cp.spawn('ffmpeg'),
    cp.spawn('ffprobe'),
    cp.spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-filter_complex', 'color', '-frames:v', '1', '-f', 'webp', '-']),
    cp.spawn('convert'),
    cp.spawn('magick'),
    cp.spawn('gm'),
  ].map(p => {
    return Promise.race([
      new Promise(resolve => {
        p.on('close', code => {
          resolve(code !== 127)
        })
      }),
      new Promise(resolve => {
        p.on('error', _ => resolve(false))
      })
    ])
  }))
  let [ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm] = test
  console.log(test)
  let s = global.support = {
    ffmpeg,
    ffprobe,
    ffmpegWebp,
    convert,
    magick,
    gm
  }
  require('./lib/sticker').support = s
  Object.freeze(global.support)

  if (!s.ffmpeg) conn.logger.warn('Please install ffmpeg for sending videos (pkg install ffmpeg)')
  if (s.ffmpeg && !s.ffmpegWebp) conn.logger.warn('Stickers may not animated without libwebp on ffmpeg (--enable-ibwebp while compiling ffmpeg)')
  if (!s.convert && !s.magick && !s.gm) conn.logger.warn('Stickers may not work without imagemagick if libwebp on ffmpeg doesnt isntalled (pkg install imagemagick)')
}

_quickTest()
  .then(() => conn.logger.info('Quick Test Done'))
  .catch(console.error)
