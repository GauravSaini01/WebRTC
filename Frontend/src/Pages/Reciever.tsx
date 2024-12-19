import { useEffect, useRef} from "react"

export function Reciever() {
    const divRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080')
        socket.onopen = () => {
            socket.send(JSON.stringify({ type: 'reciever' }))
            startRecieveingVideo(socket)
        }
    }, [])
    function startRecieveingVideo(socket : WebSocket){
        if(!socket){
            alert('Connection is not Open')
            return 
        }
        socket.onmessage = async (message) => {
            const data = JSON.parse(message.data);

            const pc = new RTCPeerConnection();
            if (data.type == 'offer') {
                pc.setRemoteDescription(data.sdp)
                pc.onicecandidate = (event) => {
                    if (event.candidate) {
                        socket.send(JSON.stringify({ type: 'iceCandidate', candidate: event.candidate }))
                    }
                }
                pc.ontrack = (event)=>{
                    if(divRef.current){
                        divRef.current.srcObject = new MediaStream([event.track])
                        divRef.current.muted = true;
                        divRef.current.play();
                    }
                }
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer)
                socket.send(JSON.stringify({ type: 'createAnswer', sdp: pc.localDescription }))

            } else if (data.type == 'iceCandidate') {
                if(pc.remoteDescription){
                    pc.addIceCandidate(data.candidate)
                }
            }
        }
    }
    return (
        <div >
            <div style={{ width: "100%", height: 500, justifyContent: "center", display: "flex" }}>
                <div>
                    <div >Reciever</div>
                    <video ref={divRef} style={{ width: 400, height: 400, borderWidth: 3, borderColor: "gray", borderStyle: "solid" }}></video>
                </div>
            </div>
        </div>
    )
}