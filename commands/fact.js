const Discord = require('discord.js');
const lineFactsData = require('../utilities/LineFacts.js');
const lineIconsData = require('../utilities/LineIcons.js');

module.exports = {
  name: 'fact',
  description: 'Returns a random subway fact!',
  cooldown: 3,
  execute(message) {
    let lineIndex = Math.floor((Math.random() * lineFactsData.lineFacts.length));
    let indexResult = Math.floor((Math.random() * lineFactsData.lineFacts[lineIndex].length));
    let lineResult = (indexResult = 0) ? 1 : indexResult + 1;
    
    let factEmbed = new Discord.MessageEmbed()
      .setTitle("MTA Facts")
      .setDescription(`The ${lineFactsData.lineFacts[lineIndex][0]} Line`)
      .setThumbnail(lineIconsData.lineIcons[lineIndex])
      .addField(`Fact #${lineIndex + 1}-${lineResult}:`, `${lineFactsData.lineFacts[lineIndex][lineResult]}`)
      .setTimestamp()

    message.channel.send(factEmbed);
  }
};
