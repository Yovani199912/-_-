let handler  = async (m, { conn, usedPrefix: _p }) => {
let info = `
╭━━━━━✯𓆩ֶ፝֟𓆪⁩✯━━━━━╮
├⇶̸̷̸̷ִִْْ❍͜͡➣𝐇𝐀𝐃𝐄𝐒_𝐁𝐎𝐓❍͜͡➣
├━━━━≪✯𓆩ֶ፝֟𓆪⁩✯≫━━━╯
├⇶❏̸̷̸̷ִִْْ〘🛑𝗢𝗯𝗲𝗱𝗲𝗰𝗲 𝗹𝗮𝘀 𝗿𝗲𝗴𝗹𝗮𝘀🛑〙
├⇶❏̸̷̸̷ִִْْ❌𝑷𝒓𝒐𝒉𝒊𝒃𝒊𝒅𝒐 𝒍𝒍𝒂𝒎𝒂𝒓 𝒂𝒍 𝒃𝒐𝒕📲
├⇶❏̸̷̸̷ִִْْ❌𝑷𝒓𝒐𝒉𝒊𝒃𝒊𝒅𝒐 𝒔𝒑𝒂𝒎 𝒂𝒍 𝒃𝒐𝒕☢
├⇶❏̸̷̸̷ִִْْ❌𝑵𝒐 𝒂𝒈𝒓𝒆𝒈𝒂𝒓 𝒂𝒍 𝒃𝒐𝒕 𝒂 𝒈𝒓𝒖𝒑𝒐𝒔♻
├⇶❏̸̷̸̷ִִْْ❍͜͡➣𝐇𝐀𝐃𝐄𝐒_𝐁𝐎𝐓❍͜͡➣
╰━━━━━✯𓆩ֶ፝֟𓆪⁩✯━━━━━╯
`.trim() 

conn.fakeReply(m.chat, info, '0@s.whatsapp.net', '❍͜͡➣𝐇𝐀𝐃𝐄𝐒_𝐁𝐎𝐓❍͜͡➣ᰰ', 'status@broadcast')
}
handler.command = /^(reglas|reglas|.reglas)$/i

module.exports = handler
