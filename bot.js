const Discord = require('discord.js');
const Canvas = require('canvas')
const { createCanvas, loadImage } = require('canvas')
const client = new Discord.Client();
const prefix = "ffg "

client.on('ready', () => {
    client.user.setActivity('with Furrets', {type: 'PLAYING'})
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('guildMemberAdd', member => {
    if (member.guild.id != 718108036002086932) return;
    const username = member.user.username;
    const guild = member.guild.name;

    async function welcomeFurret() {
        const canvas = createCanvas(2048, 1024)
        const ctx = canvas.getContext('2d')

        const bg = await Canvas.loadImage('./blankCard.png');
        const baseFurret = await Canvas.loadImage('./welcomeTemp.png');
        const furretArms = await Canvas.loadImage('./armsTemp.png');
        const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'png' }));

        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(baseFurret, -70, 0, 1024, 1024);
    
        ctx.drawImage(avatar, 230, 700, 192, 192);
        
        ctx.drawImage(furretArms, -70, 0, 1024, 1024);

	    ctx.font = '125px sans-serif';
	    ctx.fillStyle = '#ffffff';
        ctx.fillText(`Welcome ${username}\nMember: ${member.guild.memberCount}`, 775, canvas.height / 1.8);

        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), `${username}_welcome.png`);

        client.channels.cache.get('718108036765581324').send(`Welcome, ${member.user}!`, attachment);
    }
    welcomeFurret();
});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();

    if (command === "create") {
        if (args.length && message.attachments.size > 0) {
            const furretName = args.join(' ')
            message.channel.send(`Generating "${furretName} furret"`).then(msg => {
                async function genFurret() {
                    const canvas = createCanvas(1024, 1024)
                    const ctx = canvas.getContext('2d')
            
                    var Attachment = (message.attachments).array();

                    const furret = await Canvas.loadImage('./template.png');
                    const flag = await Canvas.loadImage(Attachment[0].url)

                    ctx.drawImage(flag, 0, 0, canvas.width, canvas.height);
                    ctx.drawImage(furret, 0, 0, canvas.width, canvas.height);
                    ctx.rotate(-25 * Math.PI / 180);
                    ctx.save();
                    ctx.scale(-1, 1);
                    ctx.translate(0, -100);
                    ctx.drawImage(flag, -20, 895, 225, 150);
            
                    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), `${furretName}_furret.png`);
            
                    message.channel.send(`${message.author} presenting, ${furretName} furret!`, attachment).then(msg.delete());
                }
        
                genFurret();
            })
        } else {
            message.channel.send('Please specify the name of the flag, and attach an image of the flag. Usage: `ffg create <flag name>` + `attach an image`.')
        }
    }
});

client.login(process.env.DISCORD_TOKEN);