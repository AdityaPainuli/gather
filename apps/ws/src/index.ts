import {WebSocketServer} from 'ws';


const wss = new WebSocketServer({port:3001});

wss.on("connection",function connection(ws){
    ws.on("message", function message(data) {
        console.log("message received ->", data);
        
    })
    ws.on("error" , function(err) {
        console.log("error occured in ws ->",ws)
    })
})
