import { useEffect, useRef, useState } from 'react';
import DailyIframe from '@daily-co/daily-js';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Video, VideoOff, Phone, PhoneOff, Settings } from 'lucide-react';

interface VideoCallProps {
  roomUrl?: string;
}

export const VideoCall = ({ roomUrl }: VideoCallProps) => {
  const callFrameRef = useRef<HTMLDivElement>(null);
  const [callFrame, setCallFrame] = useState<any>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  useEffect(() => {
    if (callFrameRef.current) {
      const frame = DailyIframe.createFrame(callFrameRef.current, {
        showLeaveButton: false,
        showFullscreenButton: false,
        showLocalVideo: true,
        showParticipantsBar: false,
        theme: {
          colors: {
            accent: '#22c55e',
            accentText: '#ffffff',
            background: '#0a0a0f',
            backgroundAccent: '#141419',
            baseText: '#f1f5f9',
            border: '#1e293b',
            mainAreaBg: '#0f172a',
            mainAreaBgAccent: '#1e293b',
            mainAreaText: '#f1f5f9',
            supportiveText: '#64748b'
          }
        }
      });

      frame.on('joined-meeting', () => {
        setIsJoined(true);
      });

      frame.on('left-meeting', () => {
        setIsJoined(false);
      });

      setCallFrame(frame);

      return () => {
        frame.destroy();
      };
    }
  }, []);

  const joinCall = () => {
    if (callFrame && roomUrl) {
      callFrame.join({ url: roomUrl });
    }
  };

  const leaveCall = () => {
    if (callFrame) {
      callFrame.leave();
    }
  };

  const toggleMute = () => {
    if (callFrame) {
      callFrame.setLocalAudio(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (callFrame) {
      callFrame.setLocalVideo(!isVideoOff);
      setIsVideoOff(!isVideoOff);
    }
  };

  return (
    <div className="flex flex-col h-full bg-video-bg rounded-lg overflow-hidden">
      {/* Video Area */}
      <div className="flex-1 relative">
        <div 
          ref={callFrameRef} 
          className="w-full h-full bg-video-bg"
          style={{ minHeight: '400px' }}
        />
        
        {/* Demo message when no room URL */}
        {!roomUrl && (
          <div className="absolute inset-0 flex items-center justify-center bg-video-bg">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto bg-muted rounded-full flex items-center justify-center">
                <Video className="w-8 h-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Video Call Ready</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Connect to Daily.co room to start your video call. Add your room URL to get started.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-4 bg-video-controls border-t border-border">
        <div className="flex items-center justify-center space-x-4">
          {!isJoined ? (
            <Button
              variant="default"
              size="sm"
              onClick={joinCall}
              disabled={!roomUrl}
              className="bg-gradient-primary hover:opacity-90"
            >
              <Phone className="w-4 h-4 mr-2" />
              Join Call
            </Button>
          ) : (
            <Button
              variant="destructive"
              size="sm"
              onClick={leaveCall}
            >
              <PhoneOff className="w-4 h-4 mr-2" />
              Leave
            </Button>
          )}

          <Button variant="secondary" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};