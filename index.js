const Discord = require('discord.js'),
    client = new Discord.Client({
        fetchAllMembers: true
    }),
    config = require('./config.json'),
    fs = require('fs')

    client.login(config.token)
    client.commands = new Discord.Collection()
    client.db = require('./db.json')

    fs.readdir('./commands', (err, files) => {
        if (err) throw err
        files.forEach(file => {
            if (!file.endsWith('.js')) return
            const command = require(`./commands/${file}`)
            client.commands.set(command.name, command)
        })
    })    


    client.on('message', message => {
        if (message.type !== 'DEFAULT' || message.author.bot) return
     
        const args = message.content.trim().split(/ +/g)
        const commandName = args.shift().toLowerCase()
        if (!commandName.startsWith(config.prefix)) return
        const command = client.commands.get(commandName.slice(config.prefix.length))
        if (!command) return
        command.run(message, args, client)
    })


    client.on('guildMemberAdd', member => {
        member.guild.channels.cache.get(config.greeting.channel).send(` Bienvenue ${member} n'hésite pas a aller check les salon suivant: #annonces #giveaways  ! 🎉`)
        member.roles.add(config.greeting.role)
    })


    client.on('ready', () => {
        const statuses = [
            () => `${client.guilds.cache.size} serveurs`,
            () => `${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)} utilisateurs`
        ]
        let i = 0
        setInterval(() => {
            client.user.setActivity(statuses[i](), {type: 'STREAMING', url: 'https://www.twitch.tv/>Erreur_404'})
            i = ++i % statuses.length
        }, 1e4)
    })


   


