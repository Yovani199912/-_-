const { createHash } = require('crypto')
let Reg = /(.*)([.|])([0-9]*)$/i
let handler = async function (m, { text, usedPrefix }) {
  let user = global.DATABASE._data.users[m.sender]
  if (user.registered === true) throw `
╭━━━━━✯𓆩ֶ፝֟𓆪⁩✯━━━━━╮
│⇶🤗❤️𝐘𝐀 𝐓𝐄 𝐄𝐍𝐂𝐔𝐄𝐍𝐓𝐑𝐀𝐒
│⇶𝐑𝐄𝐆𝐈𝐒𝐓𝐑𝐀𝐃𝐎 𝐀 𝐌Í 
│⇶𝐋𝐈𝐒𝐓𝐀📝   𝐃𝐀𝐓𝐎𝐒
│⇶𝐃𝐄 𝐇𝐀𝐃𝐄𝐒_𝐁𝐎𝐓❤️ 
╰━━━━━✯𓆩ֶ፝֟𓆪⁩✯━━━━━╯`
  if (!Reg.test(text)) throw `
╭━━━━━✯𓆩ֶ፝֟𓆪⁩✯━━━━━╮
│⇶  ༴⃟🌹๋ོ࣭𝐇𝐚𝐝𝐞𝐬_𝐛𝐨𝐭 ༴⃟🌹๋ོ࣭
├━━━━≪✯𓆩ֶ፝֟𓆪⁩✯≫━━━╯
│⇶🤗𝐇𝐎𝐋𝐀 𝐓𝐄 𝐈𝐍𝐕𝐈𝐓𝐀𝐌𝐎𝐒 
│⇶𝐀 𝐑𝐄𝐆𝐈𝐒𝐓𝐑𝐀𝐑𝐓𝐄 𝐀
│⇶𝐁𝐎𝐓: 𝐇𝐀𝐃𝐄𝐒_𝐁𝐎𝐓❤️✨
├━━━━≪✯𓆩ֶ፝֟𓆪⁩✯≫━━━╯
│⇶𝐅𝐨𝐫𝐦𝐚𝐭𝐨 𝐢𝐧𝐜𝐨𝐫𝐫𝐞𝐜𝐭𝐨\n
│⇶${usedPrefix}/𝐫𝐞𝐠 𝐍𝐨𝐦𝐛𝐫𝐞.𝐄𝐝𝐚𝐝
│⇶𝐄𝐣𝐞𝐦𝐩𝐥𝐨 /𝐫𝐞𝐠 𝐇𝐚𝐝𝐞𝐬.18
╰━━━━━✯𓆩ֶ፝֟𓆪⁩✯━━━━━╯`
  let [_, name, splitter, age] = text.match(Reg)
  if (!name) throw '*_El nombre no puede estar vacío_*'
  if (!age) throw '*_La edad no puede estar vacía_*'
  user.name = name
  user.age = parseInt(age)
  user.regTime = + new Date
  user.registered = true
  let sn = createHash('md5').update(m.sender).digest('hex')
  m.reply(`
╭━━━━━✯𓆩ֶ፝֟𓆪⁩✯━━━━━╮  
│⇶❤️𝐑𝐞𝐠𝐢𝐬𝐭𝐫𝐚𝐝𝐨 𝐜𝐨𝐧 é𝐱𝐢𝐭𝐨
│⇶𝐆𝐑𝐀𝐂𝐈𝐀𝐒 𝐏𝐎𝐑🥳
│⇶ 𝐑𝐄𝐆𝐈𝐒𝐓𝐑𝐀𝐑𝐓𝐄
│⇶ 𝐀 𝐇𝐀𝐃𝐄𝐒_𝐁𝐎𝐓✨❤️
╰━━━━━✯𓆩ֶ፝֟𓆪⁩✯━━━━━╯
╭━━━━━✯𓆩ֶ፝֟𓆪⁩✯━━━━━╮
│⇶  ༴⃟🌹๋ོ࣭𝐇𝐚𝐝𝐞𝐬_𝐛𝐨𝐭 ༴⃟🌹๋ོ࣭
├━━━━≪✯𓆩ֶ፝֟𓆪⁩✯≫━━━╯
│⇶𝐍𝐨𝐦𝐛𝐫𝐞: ${name}
│⇶𝐄𝐝𝐚𝐝: ${age}
╰━━━━━✯𓆩ֶ፝֟𓆪⁩✯━━━━━╯
`.trim())
}
handler.help = ['daftar', 'reg', 'register'].map(v => v + ' <nama>.<umur>')
handler.tags = ['exp']

handler.command = /^(daftar|reg(ister)?)$/i

module.exports = handler

