import { useEffect, useRef, useState } from "react"

export function Sender() {
    const divRef = useRef<HTMLVideoElement>(null);
    const [socket, setSocket] = useState<WebSocket | null>(null)

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080')
        socket.onopen = () => {
            socket.send(JSON.stringify({ type: 'sender' }))
            setSocket(socket);
        }
    }, [])
    async function startSendingVideo() {
        if(!socket){
            alert('Connection is not Open')
            return 
        }

        const pc = new RTCPeerConnection();
        pc.onnegotiationneeded = async () => {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            socket.send(JSON.stringify({ type: 'createOffer', sdp: pc.localDescription }))
        }
        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socket.send(JSON.stringify({
                    type: 'iceCandidate',
                    candidate: event.candidate
                }))
            }
        }
        socket.onmessage = async (message: any) => {
            const data = JSON.parse(message.data);
            if (data.type == 'answer') {
                await pc.setRemoteDescription(data.sdp)
            }
            if (data.type == 'iceCandidate') {
                pc.addIceCandidate(data.candidate)
            }
        }
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });

        pc.addTrack(stream.getVideoTracks()[0])
        if (divRef.current) {
            divRef.current.srcObject = new MediaStream([stream.getVideoTracks()[0]])
            divRef.current.play();
        }
    }
    return (
        <div >
            <div style={{ width: "100%", height: 500, justifyContent: "center", display: "flex" }}>
                <div>
                    <div >Sender</div>
                    <video ref={divRef} style={{ width: 400, height: 400, borderWidth: 3, borderColor: "gray", borderStyle: "solid" }}></video>
                    <div>                    
                        <button onClick={startSendingVideo}>Send Video</button>
                    </div>
                </div>
            </div>
        </div>
    )
}