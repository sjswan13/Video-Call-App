import { useEffect } from 'react';
import {
  CallControls,
  CallingState,
  ParticipantView,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
  useCallStateHooks,
  useCall,
} from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import './index.css';

const apiKey = 'mmhfdzb5evj2';
const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3Byb250by5nZXRzdHJlYW0uaW8iLCJzdWIiOiJ1c2VyL1BST1hZIiwidXNlcl9pZCI6IlBST1hZIiwidmFsaWRpdHlfaW5fc2Vjb25kcyI6NjA0ODAwLCJpYXQiOjE3MjYyNjYzMTksImV4cCI6MTcyNjg3MTExOX0.821Kvf3dKuwDO1sVVqZW044Ur3t6g5geGzYLskvUyz8';
const userId = 'PROXY';
const callId = 't62LrihR0X4y';

const user = {
  id: userId,
  name: 'Oliver',
  image: 'https://getstream.io/random_svg/?id=oliver&name=Oliver',
};

const client = new StreamVideoClient({ apiKey, user, token });
const call = client.call('default', callId);

const callSettings = {
  audio: true,
  video: true,
};

export default function App() {
  useEffect(() => {
    const joinCall = async () => {
      try {
        await call.join({ create: true, settings: callSettings });
      } catch (error) {
        console.error('Failed to join call', error);
      }
    };
    joinCall();

    return () => {
      if (call.state === CallingState.JOINED) {
        call.leave();
      }
    };
  }, []); 

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <MyUILayout />
      </StreamCall>
    </StreamVideo>
  );
}

export const MyParticipantList = ({ participants }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '8px',
        width: '100vw',
      }}
    >
      {participants.map((participant) => (
        <div style={{ width: '100%', aspectRatio: '3 / 2' }} key={participant.sessionId}>
          <ParticipantView muteAudio participant={participant} />
        </div>
      ))}
    </div>
  );
};

export const MyFloatingLocalParticipant = ({ participant }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: '15px',
        left: '15px',
        width: '240px',
        height: '135px',
        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 10px 3px',
        borderRadius: '12px',
      }}
    >
      {participant && <ParticipantView muteAudio participant={participant} />}
    </div>
  );
};

export const MyUILayout = () => {
  const call = useCall();

  const { useCallCallingState, useRemoteParticipants, useLocalParticipant } = useCallStateHooks();

  const callingState = useCallCallingState();
  const localParticipant = useLocalParticipant();
  const remoteParticipants = useRemoteParticipants();

  if (callingState !== CallingState.JOINED) {
    return <div>Loading...</div>;
  }

  return (
    <StreamTheme style={{ position: 'relative' }}>
      <MyParticipantList participants={remoteParticipants} />
      <MyFloatingLocalParticipant participant={localParticipant} />
    </StreamTheme>
  );
};
