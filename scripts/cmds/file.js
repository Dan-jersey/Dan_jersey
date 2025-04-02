 const fs = require('fs');

module.exports = {
  config: {
    name: "file",
    version: "1.0",
    author: "OtinXShiva",
    countDown: 5,
    role: 0,
    shortDescription: "Send bot script",
    longDescription: "Send bot specified file ",
    category: "owner",
    guide: "{pn} file name. Ex: .{pn} filename"
  },

  onStart: async function ({ message, args, api, event }) {
    const permission = ["61567813072795"];
    if (!permission.includes(event.senderID)) {
      return api.sendMessage("𝐓𝐔 𝐍'𝐞𝐬 𝐩𝐚𝐬 𝐚𝐝𝐦𝐢𝐧𝐢𝐬𝐭𝐫𝐚𝐭𝐞𝐮𝐫 𝐝𝐞 𝐜𝐞 𝐛𝐨𝐭 ' ", event.threadID, event.messageID);
    }

    const fileName = args[0];
    if (!fileName) {
      return api.sendMessage("𝑆𝑈𝑅 𝑄𝑈𝐸𝐿 𝐹𝐼𝐶𝐻𝐼𝐸𝑅 ?.", event.threadID, event.messageID);
    }

    const filePath = __dirname + `/${fileName}.js`;
    if (!fs.existsSync(filePath)) {
      return api.sendMessage(`✯ 𝑗𝑒 𝑛𝑒 𝑡𝑟𝑜𝑢𝑣𝑒 𝑝𝑎𝑠 𝑐𝑒𝑡𝑡𝑒 𝑐𝑚𝑑 [✖]: ${fileName}.js`, event.threadID, event.messageID);
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    api.sendMessage({ body: fileContent }, event.threadID);
  }
};
