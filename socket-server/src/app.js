const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);


const documents = {};

io.on("connection", socket => {
    let previousId;
    const safeJoin = currentId => {
        console.log('safe join used');
        socket.leave(previousId);
        socket.join(currentId);
        previousId = currentId;
    };

    socket.on("getDoc", docId => {
        console.log('get doc used');
        safeJoin(docId);
        socket.emit("document", documents[docId]);
    });

    socket.on("addDoc", doc => {
        console.log('add doc used');
        documents[doc.id] = doc;
        safeJoin(doc.id);
        io.emit("documents", Object.keys(documents));
        socket.emit("document", doc);
    });

    socket.on("editDoc", doc => {
        console.log('edit doc used');
        documents[doc.id] = doc;
        socket.to(doc.id).emit("document", doc);
    });

    io.emit("documents", Object.keys(documents));
});

http.listen(4444);
console.log('listenun to port 4444');
