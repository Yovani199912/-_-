let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/cancion de hades.mp3'
conn.sendFile(m.chat, vn, 'cancion de hades.mp3', null, m, true, {
type: 'audioMessage', // paksa tanpa convert di ffmpeg
ptt: true // true diatas ga work, sebab dipaksa tanpa convert ;v
})
}
handler.customPrefix = /cancion de hades|cancion de hades/i
handler.command = new RegExp

handler.fail = null
handler.exp = 100
module.exports = handler
