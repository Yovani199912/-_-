let fetch = require('node-fetch')
     let handler  = async (m, { conn, usedPrefix, command }) => {
    heum = await fetch(`https://api-reysekha.herokuapp.com/api/wallpaper/sakura?apikey=APIKEY`)
    json = await heum.buffer()
   conn.sendButtonImg(m.chat, json, 'sakura', '❍͜͡➣𝐇𝐀𝐃𝐄𝐒_𝐁𝐎𝐓❍͜͡➣ ᰰ', 'SIGUIENTE', `${usedPrefix + command}`, m, false)
}
handler.command = /^(sakura|Sakura)$/i

module.exports = handler


