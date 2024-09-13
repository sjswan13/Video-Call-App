import { useEffect, useState } from "react";
import {
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  SpeakerLayout,
  StreamTheme,
  CallControls,
} from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';

const apiKey = '8czsu4753tgc'; 
const userId = 'video-test';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidmlkZW8tdGVzdCJ9.nubiHPbBK0eWCIEKmqwmaeeoP1HHU_cbciJrzSb8Kl0'; 


export default function App() {
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);

  useEffect(() => {
    const myClient = new StreamVideoClient({ apiKey, user: { id: userId }, token });
    setClient(myClient);

    return () => {
      myClient.disconnectUser();
      setClient(null);
    };
  }, []);

  useEffect(() => {
    if (!client) return;
    const myCall = client.call('default', 'my-first-call');
    myCall.join({ create: true });
    setCall(myCall);

    return () => {
      setCall(null);
      myCall.leave();
    };
  }, [client]);

  if (!client || !call) return null;

  return (
    <StreamVideo client={client}>
      <StreamTheme>
        <StreamCall call={call}>
          <SpeakerLayout />
          <CallControls />
        </StreamCall>
      </StreamTheme>
    </StreamVideo>
  );
}
