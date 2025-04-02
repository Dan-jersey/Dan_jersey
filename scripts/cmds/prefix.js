 const fs = require("fs-extra");
const { utils } = global;

module.exports = {
  config: {
    name: "prefix",
    alias: ["🧋"], 
    version: "1.3",
    author: "NTKhang",
    countDown: 5,
    role: 0,
    shortDescription: "Change bot prefix",
    longDescription: "Change the bot's command symbol in your chat box or the entire bot system (admin only)",
    category: "box chat",
    guide: {
      en: "   {pn} <new prefix>: change new prefix in your box chat"
        + "\n   Example:"
        + "\n    {pn} #"
        + "\n\n   {pn} <new prefix> -g: change new prefix in system bot (only admin bot)"
        + "\n   Example:"
        + "\n    {pn} # -g"
        + "\n\n   {pn} reset: change prefix in your box chat to default"
    }
  },

  langs: {
    en: {
      reset: "Your prefix has been reset to default: %1",
      onlyAdmin: "Only admin can change prefix of system bot",
      confirmGlobal: "Please react to this message to confirm change prefix of system bot",
      confirmThisThread: "Please react to this message to confirm change prefix in your box chat",
      successGlobal: "Changed prefix of system bot to: %1",
      successThisThread: "Changed prefix in your box chat to: %1",
      myPrefix: "╭━━━━━━━━━━━━━━┑\n𝐖𝐄𝐒𝐇 𝐁𝐑𝐎 𝐓𝐔 𝐍𝐄 𝐂𝐎𝐍𝐍𝐀𝐈𝐒 𝐏𝐀𝐒 𝐌𝐎𝐍 𝐏𝐑𝐄𝐅𝐈𝐗 𝐂'𝐄𝐒𝐓  { %2 }\n𝐓𝐔 𝐌𝐄 𝐃𝐄𝐂̧𝐎𝐈𝐒   :\n\n◆━━━━━━✦━━━━━━━━◆\n 𝐀𝐁𝐎𝐍𝐍𝐄𝐙 𝐕𝐎𝐔𝐒\n◆━━━━✦━━━━━◆\nhttps://whatsapp.com/channel/0029VasZ6FaHLHQbLdUKfh33\n_______________________\n 𝐋𝐞 𝐥𝐢𝐞𝐧 𝐝𝐞 𝐦𝐚 𝐜𝐡𝐚𝐢𝐧𝐞 𝐰𝐡𝐚𝐭𝐬𝐚𝐩𝐩 𝐛𝐫𝐨\n_____________________\n𝐍'𝐨𝐮𝐛𝐥𝐢𝐞 𝐩𝐚𝐬 𝐦𝐨𝐧 𝐩𝐫𝐞𝐟𝐢𝐱 𝐚𝐯𝐞𝐧𝐭𝐮𝐫𝐢𝐞𝐫 [  %2  ] 𝐜'𝐞𝐬𝐭 𝐦𝐨𝐧 𝐩𝐫𝐞𝐟𝐢𝐱 \n_________________________\n𝐸𝐶𝑅𝐼𝑉𝐸  ★𝐡𝐞𝐥𝐩 𝑃𝑂𝑈𝑅 𝐴𝑉𝑂𝐼𝑅 𝐿𝐴 𝐿𝐼𝑆𝑇𝐸 𝐷𝐸 𝑀𝐸𝑆 𝐶𝑀𝐷𝑆\n╰━━━━━━━━━━━━━━┙ "
    }
  },

  onStart: async function ({ message, role, args, commandName, event, threadsData, getLang }) {
    if (!args[0])
      return message.SyntaxError();

    if (args[0] == 'reset') {
      await threadsData.set(event.threadID, null, "data.prefix");
      return message.reply(getLang("reset", global.GoatBot.config.prefix));
    }

    const newPrefix = args[0];
    const formSet = {
      commandName,
      author: event.senderID,
      newPrefix
    };

    if (args[1] === "-g")
      if (role < 2)
        return message.reply(getLang("onlyAdmin"));
      else
        formSet.setGlobal = true;
    else
      formSet.setGlobal = false;

    return message.reply(args[1] === "-g" ? getLang("confirmGlobal") : getLang("confirmThisThread"), (err, info) => {
      formSet.messageID = info.messageID;
      global.GoatBot.onReaction.set(info.messageID, formSet);
    });
  },

  onReaction: async function ({ message, threadsData, event, Reaction, getLang }) {
    const { author, newPrefix, setGlobal } = Reaction;
    if (event.userID !== author)
      return;
    if (setGlobal) {
      global.GoatBot.config.prefix = newPrefix;
      fs.writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 2));
      return message.reply(getLang("successGlobal", newPrefix));
    }
    else {
      await threadsData.set(event.threadID, newPrefix, "data.prefix");
      return message.reply(getLang("successThisThread", newPrefix));
    }
  },

  onChat: async function ({ event, message, getLang }) {
    if (event.body && (event.body.toLowerCase() === "prefix" || event.body.toLowerCase() === "🧋"))
      return () => {
        return message.reply(getLang("myPrefix", global.GoatBot.config.prefix, utils.getPrefix(event.threadID)));
      };
  }
};
