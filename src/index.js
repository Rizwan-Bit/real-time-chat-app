const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const { generateMessage } = require('./helpers/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./helpers/users')
const { addUserToUser, removeUserInChat, getUserInChat, getUsersInChat } = require('./helpers/iusers')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {

    socket.on('join', (options, callback) => {
        const { error, user } = addUser({ id: socket.id, ...options })

        if (error) {
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message', generateMessage('Admin', 'Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback()
    })

    socket.on('chat', (options, callback) => {
        const { error, iuser } = addUserToUser({ id: socket.id, ...options })

        if (error) {
            return callback(error)
        }

        socket.join(iuser.secret)

        socket.emit('message', generateMessage('Admin', 'Welcome!'))
        socket.broadcast.to(iuser.secret).emit('message', generateMessage('Admin', `${iuser.c_user} has joined!`))
        io.to(iuser.secret).emit('roomData', {
            secret: iuser.secret,
            users: getUsersInChat(iuser.secret)
        })

        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        const iuser = getUserInChat(socket.id)
        if(user){
            io.to(user.room).emit('message', generateMessage(user.username, message))
        } 
        if(iuser){
            io.to(iuser.secret).emit('message', generateMessage(iuser.c_user, message))
        }
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        const iuser = removeUserInChat(socket.id)

        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        } 
        if (iuser) {
            io.to(iuser.secret).emit('message', generateMessage('Admin', `${iuser.c_user} has left!`))
            io.to(iuser.secret).emit('roomData', {
                secret: iuser.secret,
                users: getUsersInChat(iuser.secret)
            })
        }
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})