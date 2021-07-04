const discord = require('discord.js')
const { json } = require('express')
const express = require("express")
const zones = {
    "Zone1": "861121623725178880",
    "Zone2": "861121639915847680",
    "Zone3": "861121679806693407"
}

const Key = "hello"

const bot = new discord.Client()
const app = express()

const users = {}


bot.on('ready', () => {
    console.log('Bot is ready')
})

bot.on('message', message => {
    if (message.content.startsWith('$resetuser')) {
        if (users[message.author.id]) {
            delete users[message.author.id]
            message.reply('Done.')
        } else {
            message.reply('You haven\'t linked your roblox account yet.')
        }
    }
})


app.get('/move', async (req,res) => {
    if (req.query.key !== Key) return res.send(JSON.stringify({
        Event: 'Failed',
        Reason: 'Wrong key.'
    }))
    if (!req.query.zone || !zones[req.query.zone]) return res.send(JSON.stringify({
        Event: 'Failed',
        Reason: 'There is no such zone....'
    }))

    const zone = zones[req.query.zone]
    const discordid = req.query.id
    if(!discordid || isNaN(discordid)) return res.send(JSON.stringify({
        Event: 'Failed',
        Reason: 'Incorrect Discord ID.'
    }))

    const user = await bot.users.fetch(discordid)
    if(!user) return res.send(JSON.stringify({
        Event: 'Failed.',
        Reason: 'Couldnt find that user in the discord server. Did you join?',
        Invite: 'https://discord.gg/UaeENVmgwx'
    }))

    const guild = await bot.guilds.cache.get('861121602301067275')
    const member = await guild.members.fetch(discordid)
    
    member.voice.setChannel(zone)

    res.send(JSON.stringify({
        Event: 'Success',
        Message: `Moved ${member.user}#${member.id} to ${zone}.`
    }))
})
app.get('/setid', async (req,res) => {
    if (req.query.key !== Key) return res.send(JSON.stringify({
        Event: 'Failed',
        Reason: 'Wrong key.'
    }))

    const robloxuser = req.query.user
    const discordid = req.query.id

    if(!robloxuser) return res.send(JSON.stringify({
        Event: 'Failed',
        Reason: 'Incorrect Roblox User.'
    }))

    if(!discordid || isNaN(discordid)) if (req.query.key !== Key) return res.send(JSON.stringify({
        Event: 'Failed',
        Reason: 'Incorrect Discord ID.'
    }))

    const user = bot.users.fetch(discordid)
    if(!user) return res.send(JSON.stringify({
        Event: 'Failed.',
        Reason: 'Couldnt find that user in the discord server. Did you join?',
        Invite: 'https://discord.gg/UaeENVmgwx'
    }))

    if (users[discordid]) {
        return res.send(JSON.stringify({
            Event: 'Failed.',
            Reason: 'A user already set their ID to that.'
        }))
    }

    users[discordid] = robloxuser

    res.send(JSON.stringify({
        Event: 'Success',
        Message: `Set ${robloxuser}'s id to ${discordid}.`
    }))
})

app.listen(3954, () => {
    console.log('Express is ready.')
})
bot.login("ODYxMTIxOTY4MDU3NDgzMzA0.YOFMVA.JwZ-7b-s-IIqzpXW-eovp9h8tDM")