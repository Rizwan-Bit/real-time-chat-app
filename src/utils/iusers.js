const iUsers = []

const addUserToUser = ({id, c_user, secret}) => {

    // Validate data
    if(!c_user || !secret){
        return {
            error: 'Both names are required!'
        }
    }

    // Clean Data
    c_user = c_user.trim().toLowerCase()
    secret = secret.trim().toLowerCase()

    // Check for existing user
    const existingUser = iUsers.find((user) => {
        return user.secret === secret && user.c_user === c_user
    })

    // Validate username
    if (existingUser) {
        return {
            error: 'Username is already taken, Try another!'
        }
    }

    // store user
    const iuser = {id, c_user, secret}
    iUsers.push(iuser)
    return { iuser }
}

const getUserInChat = (id) => {
    const iuser = iUsers.find((user) => {
        return user.id === id
    })

    return iuser
}

const getUsersInChat = (secret) => {
    secret = secret.trim().toLowerCase()
    const iuser = iUsers.filter((user) => user.secret === secret)
    return iuser
}

const removeUserInChat = (id) => {
    const index = iUsers.findIndex((user) => user.id === id)

    if (index !== -1) {
        const iuser = iUsers.splice(index, 1)[0]
        return iuser 
    }
}

module.exports = {
    addUserToUser,
    removeUserInChat,
    getUserInChat,
    getUsersInChat
}