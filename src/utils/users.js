const users = []

const addUser = ({ id, username, room }) => {

    // Validate the data
    if (!username) {
        return {
            error: 'Username is required!'
        }
    }

    // Clean the data
    username = username.trim().toLowerCase()
    room = "Node.js"

    // Check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    // Validate username
    if (existingUser) {
        return {
            error: 'Username is already taken, Try another!'
        }
    }

    // Store user
    const user = { id, username, room }
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        const user = users.splice(index, 1)[0]
        return user
    }
}

const getUser = (id) => {
    const user = users.find((user) => user.id === id)
    return user
}

const getUsersInRoom = (room) => {
    room = "Node.js"
    const user = users.filter((user) => user.room === room)
    return user
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
}