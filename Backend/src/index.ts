import { WebSocketServer, WebSocket} from "ws";

const wss = new WebSocketServer({port : 8080});

let senderWS : null | WebSocket = null;
let recieverWS : null | WebSocket = null;

wss.on('connection', (ws)=>{
    ws.on('error',console.error);

    ws.on('message', (message : string)=> {
        const data = JSON.parse(message.toString());
        switch(data.type){
            case 'sender' :
                senderWS = ws;
                console.log('Sender Connected');
                break;
            case 'reciever' :
                recieverWS = ws;
                console.log("Reciever Connected");
                break;
            case 'createOffer' :
                recieverWS?.send(JSON.stringify({type : "offer" , sdp : data.sdp}));
                console.log('Offer Created')
                break;
            case 'createAnswer' :
                senderWS?.send(JSON.stringify({type : "answer", sdp : data.sdp}))
                console.log('Answer Created')
                break;
            case 'iceCandidate' :
                if(ws == senderWS){
                    recieverWS?.send(JSON.stringify({type : "iceCandidate" , candidate : data.candidate}));
                }else{
                    senderWS?.send(JSON.stringify({type : "iceCandidate", candidate : data.candidate}))
                }
                break;
            default :
                console.log('Something Wrong')
        }
    })
})