
var extend = require('util')._extend;

var rooms = [];
var connections = [];



var Room = function(model){
    this.hash = model.hash;
    this.users = [];
};
Room.prototype.getHash = function(){
    return this.hash;
};
Room.prototype.setHash = function(hash){
    this.hash = hash;
};
Room.prototype.hasUser = function(user){
    for (var i in this.users) {
        if (this.users[i].uid == user.uid) {
            return i;
        }
    }
    return false;
}
Room.prototype.addUser = function(user){
    if (!this.hasUser(user)) {
        this.users.push(user);
    }
}
Room.prototype.remUser = function(user){
    var userFound = this.hasUser(user);
    if (userFound!==false) {
        this.users.splice(userFound, 1);
    }
}
Room.prototype.getUsers = function(){
    return this.users;
}

Room.prototype.hasConnection = function(connection) {
    var found = false;
    connections.forEach(function(value, index) {
        if (value.connection === connection) {
            found = index;
            return false;
        }
    });
    
    return found;
}

Room.prototype.addConnection = function(connection) {
    if (this.hasConnection(connection) === false) {
        console.log('adding connection to room: '+this.getHash());
        connections.push({room: this, connection: connection});
    } else {
        console.log('room already exists: '+this.getHash());
    }
}
Room.prototype.remConnection = function(connection) {
    var connectionFound = this.hasConnection(connection);
    console.log('Going to remove connection from room: ', this.getHash(), ' id: ', connectionFound);
    if (connectionFound!==false) {
        connections.splice(connectionFound, 1);
    }
}
Room.prototype.getConnections = function() {
    var connsList = [];
    
    for (var i in connections) {
        var currentConnectionWithRoom = connections[i];

        if (currentConnectionWithRoom.room === this) {
            connsList.push( currentConnectionWithRoom.connection );
        }
    }
    return connsList;
}




function getRoomByHash(hash) {
    for (var i in rooms) {
        if (rooms[i].getHash() == hash) {
            return rooms[i];
        }
    }
    return false;
}




var MappingManager = {
    rooms : rooms,
    
    remUserFromRoom : function(user, roomHash, connection) {
        var room = getRoomByHash(roomHash);
        if (room) {
            room.remUser(user);
            room.remConnection(connection);
        }
    },
    
    addUserToRoom : function(user, roomHash, connection) {
        var room = getRoomByHash(roomHash);
        
        if (!room) {
            room = new Room({hash: roomHash});
            this.rooms.push(room);
        }
        
        room.addUser(user);
        room.addConnection(connection);
    },
    
    getConnectionsForRoom : function(roomHash) {
        var room = getRoomByHash(roomHash);
        
        if (room) {
            return room.getConnections();
        } else {
            console.log('room '+roomHash+' not found');
            return [];
        }
    },
    
    getUsersInRoom : function(roomHash) {
        var room = getRoomByHash(roomHash);
        if (room) {
            return room.getUsers();
        } else {
            return [];
        }
    }
};

module.exports = MappingManager;