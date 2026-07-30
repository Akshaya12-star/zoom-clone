import { useRef, useState } from "react";
import { firestore } from "./firebase";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  addDoc,
} from "firebase/firestore";

const servers = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

function App() {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pc = useRef(new RTCPeerConnection(servers));
  const localStream = useRef(null);
  const remoteStream = useRef(new MediaStream());

  const [roomId, setRoomId] = useState("");
  const [joinRoomId, setJoinRoomId] = useState("");

  const setupMedia = async () => {
    localStream.current = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    localStream.current.getTracks().forEach((track) => {
      pc.current.addTrack(track, localStream.current);
    });

    pc.current.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.current.addTrack(track);
      });
    };

    localVideoRef.current.srcObject = localStream.current;
    remoteVideoRef.current.srcObject = remoteStream.current;
  };

  const createRoom = async () => {
    await setupMedia();

    const roomRef = doc(collection(firestore, "rooms"));
    const callerCandidates = collection(roomRef, "callerCandidates");
    const calleeCandidates = collection(roomRef, "calleeCandidates");

    pc.current.onicecandidate = (event) => {
      if (event.candidate) {
        addDoc(callerCandidates, event.candidate.toJSON());
      }
    };

    const offer = await pc.current.createOffer();
    await pc.current.setLocalDescription(offer);

    await setDoc(roomRef, {
      offer: { type: offer.type, sdp: offer.sdp },
    });

    setRoomId(roomRef.id);

    onSnapshot(roomRef, (snapshot) => {
      const data = snapshot.data();
      if (!pc.current.currentRemoteDescription && data?.answer) {
        pc.current.setRemoteDescription(new RTCSessionDescription(data.answer));
      }
    });

    onSnapshot(calleeCandidates, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          pc.current.addIceCandidate(new RTCIceCandidate(change.doc.data()));
        }
      });
    });
  };

  const joinRoom = async () => {
    await setupMedia();

    const roomRef = doc(firestore, "rooms", joinRoomId);
    const roomSnap = await getDoc(roomRef);

    if (!roomSnap.exists()) {
      alert("Room not found");
      return;
    }

    const callerCandidates = collection(roomRef, "callerCandidates");
    const calleeCandidates = collection(roomRef, "calleeCandidates");

    pc.current.onicecandidate = (event) => {
      if (event.candidate) {
        addDoc(calleeCandidates, event.candidate.toJSON());
      }
    };

    const offer = roomSnap.data().offer;
    await pc.current.setRemoteDescription(new RTCSessionDescription(offer));

    const answer = await pc.current.createAnswer();
    await pc.current.setLocalDescription(answer);

    await updateDoc(roomRef, {
      answer: { type: answer.type, sdp: answer.sdp },
    });

    onSnapshot(callerCandidates, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          pc.current.addIceCandidate(new RTCIceCandidate(change.doc.data()));
        }
      });
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Zoom Clone (React + Firebase)</h1>

      <div style={{ display: "flex", gap: 20 }}>
        <div>
          <h3>Local</h3>
          <video ref={localVideoRef} autoPlay playsInline muted width={300} />
        </div>
        <div>
          <h3>Remote</h3>
          <video ref={remoteVideoRef} autoPlay playsInline width={300} />
        </div>
      </div>

      <hr />

      <div>
        <button onClick={createRoom}>Create Call</button>
        {roomId && <p>Share this Room ID: <b>{roomId}</b></p>}
      </div>

      <div style={{ marginTop: 20 }}>
        <input
          placeholder="Enter Room ID"
          value={joinRoomId}
          onChange={(e) => setJoinRoomId(e.target.value)}
        />
        <button onClick={joinRoom}>Join Call</button>
      </div>
    </div>
  );
}

export default App;