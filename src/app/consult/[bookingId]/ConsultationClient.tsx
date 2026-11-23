'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileText,
  ExternalLink,
  User,
  Stethoscope,
  ChevronRight,
  ChevronDown,
  Lock,
  Wifi,
  WifiOff,
  Maximize2,
  Minimize2,
  Loader2,
  Calendar,
  Info,
  X,
  Volume2,
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type {
  IAgoraRTCClient,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
  IRemoteVideoTrack,
  IRemoteAudioTrack,
  NetworkQuality,
} from 'agora-rtc-sdk-ng';

// Clinical & Connection Interfaces
interface BookingData {
  id: string;
  tokenNumber: string;
  serviceName: string;
  doctorName: string;
  mode: string;
  date: string;
  slot: string;
  slotStart: string;
  slotEnd: string;
  patientName: string;
  whatsappNumber: string;
  email?: string;
  age: number;
  gender: string;
  primaryComplaint: string;
  reports: Array<{ id: string; name: string; url: string }>;
  status: string;
  razorpayOrderId?: string;
  isTestBooking?: boolean;
  patientJoinedAt?: string | null;
  doctorJoinedAt?: string | null;
  callStartedAt?: string | null;
  callEndedAt?: string | null;
}

interface CallStatusData {
  serverNow: string;
  windowOpensAt: string;
  windowEnd: string;
  isTooEarly: boolean;
  isInWindow: boolean;
  isEnded: boolean;
  secondsRemaining: number;
  patientWaiting: boolean;
  doctorConnected: boolean;
  status: string;
}

interface TokenResponse {
  token: string;
  channelName: string;
  appId: string;
  uid: number;
  windowOpensAt: string;
  windowClosesAt: string;
  secondsRemaining: number;
  proofToken?: string;
}

type CallPhase = 'loading' | 'gate' | 'waiting' | 'in_call' | 'ended' | 'error';

interface ConsultationClientProps {
  bookingId: string;
  initialRole: 'patient' | 'doctor';
}

export function ConsultationClient({ bookingId, initialRole }: ConsultationClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlRole = searchParams.get('role');
  const effectiveInitialRole: 'patient' | 'doctor' =
    urlRole === 'patient' ? 'patient' : urlRole === 'doctor' ? 'doctor' : initialRole;

  const { language, t } = useLanguage();
  const ct = t.consultation;

  // Phase & Auth state
  const [phase, setPhase] = useState<CallPhase>('loading');
  const [role, setRole] = useState<'patient' | 'doctor'>(effectiveInitialRole);
  const [phoneLast4, setPhoneLast4] = useState('');
  const [gateError, setGateError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Booking & Window timing state
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [callStatus, setCallStatus] = useState<CallStatusData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [nowMs, setNowMs] = useState<number>(Date.now());
  const [countdownStr, setCountdownStr] = useState<string>('');

  // Hardware Devices & Permissions (Waiting Room Preview)
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [mics, setMics] = useState<MediaDeviceInfo[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');
  const [selectedMicId, setSelectedMicId] = useState<string>('');
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [hasMicPermission, setHasMicPermission] = useState<boolean | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [micLevel, setMicLevel] = useState<number>(0);

  // In-Call Agora State
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isPipSwapped, setIsPipSwapped] = useState(false);
  const [remoteConnected, setRemoteConnected] = useState(false);
  const [remoteVideoActive, setRemoteVideoActive] = useState(false);
  const [connectionState, setConnectionState] = useState<string>('DISCONNECTED');
  const [networkQuality, setNetworkQuality] = useState<number>(1); // 1 = good
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [doctorPanelOpen, setDoctorPanelOpen] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [statusBanner, setStatusBanner] = useState<string | null>(null);

  // Refs for Video Containers & Local Hardware Streams
  const previewVideoRef = useRef<HTMLVideoElement | null>(null);
  const previewStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const localVideoContainerRef = useRef<HTMLDivElement | null>(null);
  const remoteVideoContainerRef = useRef<HTMLDivElement | null>(null);

  // Agora Instance Refs (Client only, never server)
  const agoraClientRef = useRef<IAgoraRTCClient | null>(null);
  const localAudioTrackRef = useRef<IMicrophoneAudioTrack | null>(null);
  const localVideoTrackRef = useRef<ICameraVideoTrack | null>(null);
  const tokenDataRef = useRef<TokenResponse | null>(null);
  const heartbeatTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null);

  // ---------------------------------------------------------------------------
  // 1. Initial Load: Fetch Booking & Public Call Status
  // ---------------------------------------------------------------------------
  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/call/status?bookingId=${bookingId}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setCallStatus(data);
        return data as CallStatusData;
      }
    } catch (err) {
      console.warn('Call status check error:', err);
    }
    return null;
  }, [bookingId]);

  useEffect(() => {
    let isMounted = true;

    async function initializeRoom() {
      try {
        // Fetch booking
        const bookingRes = await fetch(`/api/bookings/${bookingId}`);
        const bookingJson = await bookingRes.json();

        if (!bookingRes.ok || !bookingJson.success || !bookingJson.booking) {
          if (isMounted) {
            setErrorMessage(bookingJson.message || 'Appointment not found');
            setPhase('error');
          }
          return;
        }

        const bData: BookingData = bookingJson.booking;
        if (isMounted) setBooking(bData);

        if (bData.status === 'COMPLETED' || bData.callEndedAt) {
          if (isMounted) setPhase('ended');
          return;
        }

        // Fetch live call timing status
        const statusData = await fetchStatus();

        // Check if user is a doctor via doctor session endpoint or URL param
        let isDoc = false;
        if (urlRole === 'patient') {
          isDoc = false;
        } else if (urlRole === 'doctor') {
          isDoc = true;
        } else {
          const sessionRes = await fetch('/api/call/session');
          const sessionJson = await sessionRes.json().catch(() => ({ isDoctor: false }));
          isDoc = sessionJson.isDoctor || role === 'doctor';
        }
        if (isMounted) setRole(isDoc ? 'doctor' : 'patient');

        // Check if patient already holds a valid proof cookie
        if (!isDoc) {
          // Probe token endpoint with empty phone to test proof cookie
          const probeRes = await fetch('/api/call/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bookingId, role: 'patient' }),
          });
          const probeJson = await probeRes.json();
          if (probeRes.ok && probeJson.success) {
            tokenDataRef.current = probeJson;
            if (isMounted) setPhase('waiting');
            return;
          }
        } else {
          // Doctor role: fetch token directly using doctor session
          const docTokenRes = await fetch('/api/call/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bookingId, role: 'doctor' }),
          });
          const docTokenJson = await docTokenRes.json();
          if (docTokenRes.ok && docTokenJson.success) {
            tokenDataRef.current = docTokenJson;
            if (isMounted) setPhase('waiting');
            return;
          } else {
            // Never send doctors into the patient phone verification gate
            console.error('Doctor call token error:', docTokenJson);
            if (isMounted) {
              setErrorMessage(
                docTokenJson.message || 'Unable to join consultation as doctor. Please verify your doctor credentials.'
              );
              setPhase('error');
            }
            return;
          }
        }

        // Default: Show gate for patient
        if (isMounted) setPhase('gate');
      } catch (err) {
        if (isMounted) {
          setErrorMessage('Could not load appointment details. Please check your connection.');
          setPhase('error');
        }
      }
    }

    initializeRoom();

    return () => {
      isMounted = false;
    };
  }, [bookingId, fetchStatus, role]);

  // ---------------------------------------------------------------------------
  // 2. Countdown Timer for TOO_EARLY and Slot Timing
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      setNowMs(now);

      if (callStatus?.windowOpensAt) {
        const opensMs = new Date(callStatus.windowOpensAt).getTime();
        const diffSec = Math.max(0, Math.floor((opensMs - now) / 1000));

        if (diffSec <= 0) {
          setCountdownStr('');
        } else {
          const days = Math.floor(diffSec / 86400);
          const hours = Math.floor((diffSec % 86400) / 3600);
          const mins = Math.floor((diffSec % 3600) / 60);
          const secs = diffSec % 60;

          if (days > 0) {
            setCountdownStr(`${days}d ${hours}h ${mins}m`);
          } else if (hours > 0) {
            setCountdownStr(`${hours}h ${mins}m ${secs}s`);
          } else {
            setCountdownStr(`${mins}m ${secs}s`);
          }
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [callStatus]);

  // ---------------------------------------------------------------------------
  // 3. Waiting Room Hardware Preview & Device Selector
  // ---------------------------------------------------------------------------
  const stopPreviewTracks = useCallback(() => {
    if (previewStreamRef.current) {
      previewStreamRef.current.getTracks().forEach((track) => track.stop());
      previewStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setMicLevel(0);
  }, []);

  const startMediaPreview = useCallback(
    async (cameraId?: string, micId?: string) => {
      stopPreviewTracks();
      setPermissionError(null);

      try {
        const constraints: MediaStreamConstraints = {
          video: cameraId ? { deviceId: { exact: cameraId } } : true,
          audio: micId ? { deviceId: { exact: micId } } : true,
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        previewStreamRef.current = stream;
        setHasCameraPermission(true);
        setHasMicPermission(true);

        if (previewVideoRef.current) {
          previewVideoRef.current.srcObject = stream;
        }

        // Enumerate devices once permission is granted
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter((d) => d.kind === 'videoinput');
        const audioDevices = devices.filter((d) => d.kind === 'audioinput');

        setCameras(videoDevices);
        setMics(audioDevices);

        if (!selectedCameraId && videoDevices.length > 0) {
          setSelectedCameraId(videoDevices[0].deviceId);
        }
        if (!selectedMicId && audioDevices.length > 0) {
          setSelectedMicId(audioDevices[0].deviceId);
        }

        // Setup real-time Audio Meter via AnalyserNode
        try {
          const AudioContextClass =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          const audioCtx = new AudioContextClass();
          audioContextRef.current = audioCtx;

          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 256;
          const source = audioCtx.createMediaStreamSource(stream);
          source.connect(analyser);

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          let animId: number;

          const checkLevel = () => {
            if (!previewStreamRef.current) return;
            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const avg = sum / dataArray.length;
            setMicLevel(Math.min(100, Math.round((avg / 128) * 100)));
            animId = requestAnimationFrame(checkLevel);
          };

          animId = requestAnimationFrame(checkLevel);
        } catch {
          // AudioContext fallback
        }
      } catch (err: unknown) {
        console.warn('Camera/Mic permission warning:', err);
        const name = (err as { name?: string }).name;
        if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
          setHasCameraPermission(false);
          setHasMicPermission(false);
          setPermissionError('Camera and Microphone access was blocked.');
        } else {
          setPermissionError('Could not access camera or microphone.');
        }
      }
    },
    [selectedCameraId, selectedMicId, stopPreviewTracks]
  );

  // Start preview when entering waiting room
  useEffect(() => {
    if (phase === 'waiting') {
      startMediaPreview(selectedCameraId, selectedMicId);
    } else {
      stopPreviewTracks();
    }
    return () => {
      stopPreviewTracks();
    };
  }, [phase, startMediaPreview, selectedCameraId, selectedMicId, stopPreviewTracks]);

  // ---------------------------------------------------------------------------
  // 4. Patient Gate: Verify Phone Last 4
  // ---------------------------------------------------------------------------
  const handleVerifyPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneLast4.trim().length !== 4) {
      setGateError('Please enter exactly 4 digits');
      return;
    }

    setIsVerifying(true);
    setGateError(null);

    try {
      const res = await fetch('/api/call/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          role: role === 'doctor' ? 'doctor' : 'patient',
          phoneLast4: phoneLast4.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.code === 'TOO_EARLY') {
          setCallStatus((prev) => (prev ? { ...prev, isTooEarly: true, windowOpensAt: data.windowOpensAt } : null));
          setGateError(data.message || 'Consultation room has not yet opened.');
        } else if (data.code === 'ENDED') {
          setGateError(data.message || 'This consultation window has concluded.');
        } else if (data.code === 'RATE_LIMITED') {
          setGateError(data.message || 'Too many attempts. Please try again in a moment.');
        } else {
          setGateError(data.message || ct.invalidDetails);
        }
        return;
      }

      tokenDataRef.current = data;
      setPhase('waiting');
    } catch {
      setGateError('Network error verifying credentials. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  // ---------------------------------------------------------------------------
  // 5. Join Agora Call (Dynamic Import of agora-rtc-sdk-ng)
  // ---------------------------------------------------------------------------
  const handleJoinCall = async () => {
    if (!tokenDataRef.current) {
      // Refresh token if missing
      try {
        const tokenRes = await fetch('/api/call/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bookingId, role }),
        });
        const tokenJson = await tokenRes.json();
        if (tokenRes.ok && tokenJson.success) {
          tokenDataRef.current = tokenJson;
        } else {
          alert('Could not authenticate video session.');
          return;
        }
      } catch {
        alert('Network connection error.');
        return;
      }
    }

    setIsJoining(true);
    stopPreviewTracks(); // Stop preview before Agora takes hardware lock
    // Brief 150ms buffer to allow OS to release webcam hardware lock
    await new Promise((r) => setTimeout(r, 150));

    try {
      const { appId, channelName, token, uid } = tokenDataRef.current!;

      // Handle simulation mode if running without real Agora credentials
      const isMock = !appId || appId === 'placeholder_agora_app_id' || token.startsWith('007_vankal_mock_');
      if (isMock) {
        console.warn('[Consultation] Running in local simulation mode (mock token).');
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: selectedCameraId ? { deviceId: { exact: selectedCameraId } } : true,
            audio: selectedMicId ? { deviceId: { exact: selectedMicId } } : true,
          });
          previewStreamRef.current = stream;
          setPhase('in_call');
          setTimeout(() => {
            if (localVideoContainerRef.current) {
              const vid = document.createElement('video');
              vid.srcObject = stream;
              vid.autoplay = true;
              vid.playsInline = true;
              vid.muted = true;
              vid.className = 'w-full h-full object-cover scale-x-[-1]';
              localVideoContainerRef.current.innerHTML = '';
              localVideoContainerRef.current.appendChild(vid);
            }
          }, 200);
          return;
        } catch (mediaErr) {
          console.warn('[Consultation] Simulation stream fallback failed:', mediaErr);
          setPhase('in_call');
          return;
        }
      }

      // Dynamic import of Agora RTC SDK strictly inside browser execution
      const AgoraRTC = (await import('agora-rtc-sdk-ng')).default;
      AgoraRTC.setLogLevel(3); // Warnings & Errors only

      // Listen for browser autoplay policy rejections globally
      if (typeof (AgoraRTC as any).onAudioAutoplayFailed === 'function') {
        (AgoraRTC as any).onAudioAutoplayFailed = () => {
          console.warn('[Agora RTC] Audio autoplay blocked by browser policy.');
          setStatusBanner('Audio paused by browser. Tap anywhere to enable sound.');
        };
      }

      const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
      agoraClientRef.current = client;

      // 1. REGISTER AGORA EVENT HANDLERS *BEFORE* JOINING
      // (Crucial: registering before join guarantees no published tracks are missed)
      client.on('user-published', async (user, mediaType) => {
        try {
          await client.subscribe(user, mediaType);

          if (mediaType === 'video') {
            setRemoteVideoActive(true);
            setRemoteConnected(true);
            if (remoteVideoContainerRef.current) {
              user.videoTrack?.play(remoteVideoContainerRef.current);
            }
          }

          if (mediaType === 'audio') {
            setRemoteConnected(true);
            try {
              if (user.audioTrack) {
                user.audioTrack.setVolume(100);
                user.audioTrack.play();
              }
            } catch (audioPlayErr) {
              console.warn('[Agora RTC] Remote audio play blocked by browser policy:', audioPlayErr);
              setStatusBanner('Tap anywhere to enable audio');
              const unlockAudio = () => {
                try {
                  user.audioTrack?.play();
                } catch {}
                window.removeEventListener('click', unlockAudio);
                window.removeEventListener('touchstart', unlockAudio);
              };
              window.addEventListener('click', unlockAudio);
              window.addEventListener('touchstart', unlockAudio);
            }
          }

          setStatusBanner(role === 'patient' ? ct.doctorConnected : ct.patientConnected);
          setTimeout(() => setStatusBanner(null), 3500);
        } catch (subErr) {
          console.error('[Agora RTC] Error subscribing to remote track:', subErr);
        }
      });

      client.on('user-unpublished', (user, mediaType) => {
        if (mediaType === 'video') {
          setRemoteVideoActive(false);
        }
      });

      client.on('user-left', () => {
        setRemoteConnected(false);
        setRemoteVideoActive(false);
        setStatusBanner(role === 'patient' ? ct.waitingForDoctor : ct.waitingForPatient);
      });

      client.on('connection-state-change', (curState) => {
        setConnectionState(curState);
      });

      client.on('network-quality', (stats) => {
        // Average downlink & uplink network quality
        const quality = Math.max(stats.downlinkNetworkQuality, stats.uplinkNetworkQuality);
        setNetworkQuality(quality);
      });

      // Token privilege auto-renewal shortly before expiry
      client.on('token-privilege-will-expire', async () => {
        try {
          const res = await fetch('/api/call/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bookingId, role }),
          });
          const data = await res.json();
          if (res.ok && data.success && data.token) {
            await client.renewToken(data.token);
            tokenDataRef.current = data;
          } else {
            handleLeave(ct.endedDesc);
          }
        } catch {
          // Graceful handling
        }
      });

      // 2. JOIN RTC CHANNEL
      await client.join(appId, channelName, token, uid);

      // Check if any participants are already in the channel and subscribe immediately
      for (const existingUser of client.remoteUsers) {
        if (existingUser.hasAudio) {
          try {
            await client.subscribe(existingUser, 'audio');
            if (existingUser.audioTrack) {
              existingUser.audioTrack.setVolume(100);
              existingUser.audioTrack.play();
            }
            setRemoteConnected(true);
          } catch (e) {
            console.warn('[Agora RTC] Error playing existing user audio:', e);
          }
        }
        if (existingUser.hasVideo) {
          try {
            await client.subscribe(existingUser, 'video');
            setRemoteVideoActive(true);
            setRemoteConnected(true);
            if (remoteVideoContainerRef.current) {
              existingUser.videoTrack?.play(remoteVideoContainerRef.current);
            }
          } catch (e) {
            console.warn('[Agora RTC] Error playing existing user video:', e);
          }
        }
      }

      // 3. CREATE LOCAL MEDIA TRACKS WITH MULTI-TIER FALLBACK
      let audioTrack: IMicrophoneAudioTrack | null = null;
      let videoTrack: ICameraVideoTrack | null = null;

      // Tier 1: Try specific mic device with Acoustic Echo Cancellation, Noise Suppression, and AGC
      if (selectedMicId) {
        try {
          audioTrack = await AgoraRTC.createMicrophoneAudioTrack({
            microphoneId: selectedMicId,
            AEC: true,
            ANS: true,
            AGC: true,
          });
        } catch (aErr) {
          console.warn('[Agora RTC] Specific microphone acquisition failed, falling back to default:', aErr);
        }
      }

      // Tier 2: Try default microphone
      if (!audioTrack) {
        try {
          audioTrack = await AgoraRTC.createMicrophoneAudioTrack({
            AEC: true,
            ANS: true,
            AGC: true,
          });
        } catch (aErr2) {
          console.error('[Agora RTC] Default microphone acquisition failed:', aErr2);
        }
      }

      // Camera acquisition with fallback
      if (selectedCameraId) {
        try {
          videoTrack = await AgoraRTC.createCameraVideoTrack({
            cameraId: selectedCameraId,
            encoderConfig: '720p_2',
          });
        } catch (vErr) {
          console.warn('[Agora RTC] Specific camera acquisition failed, falling back to default:', vErr);
        }
      }

      if (!videoTrack) {
        try {
          videoTrack = await AgoraRTC.createCameraVideoTrack({
            encoderConfig: '720p_2',
          });
        } catch (vErr2) {
          console.error('[Agora RTC] Default camera acquisition failed:', vErr2);
        }
      }

      localAudioTrackRef.current = audioTrack;
      localVideoTrackRef.current = videoTrack;

      // Ensure tracks are unmuted and enabled initially
      if (audioTrack) {
        audioTrack.setEnabled(true);
        if (typeof (audioTrack as any).setMuted === 'function') {
          (audioTrack as any).setMuted(false);
        }
      }

      const tracksToPublish = [audioTrack, videoTrack].filter(Boolean) as (IMicrophoneAudioTrack | ICameraVideoTrack)[];
      if (tracksToPublish.length > 0) {
        await client.publish(tracksToPublish);
        console.log(`[Agora RTC] Successfully published ${tracksToPublish.length} local track(s). Audio: ${Boolean(audioTrack)}, Video: ${Boolean(videoTrack)}`);
      }

      // Play local video in PiP container after component renders
      setPhase('in_call');
      setTimeout(() => {
        if (localVideoContainerRef.current && localVideoTrackRef.current) {
          localVideoTrackRef.current.play(localVideoContainerRef.current);
        }
      }, 200);

      // Start Call Ping Heartbeat (every 15 seconds)
      heartbeatTimerRef.current = setInterval(async () => {
        try {
          const pingRes = await fetch('/api/call/ping', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bookingId, role }),
          });
          const pingData = await pingRes.json();
          if (pingData.callEnded) {
            handleLeave(ct.endedDesc);
          }
        } catch {
          // Heartbeat failure ignored
        }
      }, 15000);

      // Initial ping immediately
      fetch('/api/call/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, role }),
      }).catch(() => {});

      // Start elapsed timer
      sessionTimerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Error joining Agora call:', err);
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('Permission') || msg.includes('NotAllowedError')) {
        alert('Could not access camera or microphone. Please ensure permissions are granted.');
      } else if (msg.includes('INVALID_VENDOR_KEY') || msg.includes('DYNAMIC_USE_WEB_SECURITY_KEY')) {
        alert('Agora service authentication error: Invalid App ID or Token.');
      } else {
        alert(`Connection failed: ${msg}`);
      }
      setPhase('waiting');
    } finally {
      setIsJoining(false);
    }
  };

  // ---------------------------------------------------------------------------
  // 6. Clean Leave / Disconnect Logic
  // ---------------------------------------------------------------------------
  const handleLeave = useCallback(
    (reason?: string) => {
      if (heartbeatTimerRef.current) {
        clearInterval(heartbeatTimerRef.current);
        heartbeatTimerRef.current = null;
      }
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current);
        sessionTimerRef.current = null;
      }

      if (localAudioTrackRef.current) {
        localAudioTrackRef.current.stop();
        localAudioTrackRef.current.close();
        localAudioTrackRef.current = null;
      }
      if (localVideoTrackRef.current) {
        localVideoTrackRef.current.stop();
        localVideoTrackRef.current.close();
        localVideoTrackRef.current = null;
      }
      if (agoraClientRef.current) {
        agoraClientRef.current.leave().catch(() => {});
        agoraClientRef.current = null;
      }

      if (reason) setErrorMessage(reason);
      setPhase('ended');
    },
    []
  );

  // Tab close & unmount cleanup
  useEffect(() => {
    const handlePageHide = () => {
      if (agoraClientRef.current) {
        agoraClientRef.current.leave().catch(() => {});
      }
    };

    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('beforeunload', handlePageHide);

    return () => {
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('beforeunload', handlePageHide);
      handleLeave();
    };
  }, [handleLeave]);

  // Toggle Controls
  const toggleMute = () => {
    if (localAudioTrackRef.current) {
      const nextState = !isMuted;
      localAudioTrackRef.current.setEnabled(!nextState);
      if (typeof (localAudioTrackRef.current as any).setMuted === 'function') {
        (localAudioTrackRef.current as any).setMuted(nextState);
      }
      setIsMuted(nextState);
    }
  };

  const toggleVideo = () => {
    if (localVideoTrackRef.current) {
      const nextState = !isVideoOff;
      localVideoTrackRef.current.setEnabled(!nextState);
      setIsVideoOff(nextState);
    }
  };

  const flipCamera = async () => {
    if (cameras.length < 2 || !localVideoTrackRef.current) return;
    const currentIndex = cameras.findIndex((c) => c.deviceId === selectedCameraId);
    const nextIndex = (currentIndex + 1) % cameras.length;
    const nextCamera = cameras[nextIndex];
    try {
      await localVideoTrackRef.current.setDevice(nextCamera.deviceId);
      setSelectedCameraId(nextCamera.deviceId);
    } catch (err) {
      console.warn('Camera flip error:', err);
    }
  };

  // ---------------------------------------------------------------------------
  // 7. Doctor Actions: End Call & Mark No-Show
  // ---------------------------------------------------------------------------
  const handleDoctorEndCall = async () => {
    if (!window.confirm(ct.endConfirm)) return;
    try {
      await fetch('/api/call/end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId }),
      });
      handleLeave();
    } catch {
      alert('Could not record call completion.');
    }
  };

  const handleDoctorNoShow = async () => {
    if (!window.confirm(ct.noShowConfirm)) return;
    try {
      const res = await fetch('/api/call/no-show', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert('Patient successfully marked as NO-SHOW.');
        handleLeave();
      } else {
        alert(data.message || 'Could not record no-show.');
      }
    } catch {
      alert('Network error marking no-show.');
    }
  };

  // Format Elapsed Time MM:SS
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Check if No-Show is eligible (slot_start + 10 min)
  const isNoShowEligible = () => {
    if (!booking) return false;
    const [h, m] = (booking.slotStart || '10:00').split(':');
    const slotStartIso = `${booking.date}T${h.padStart(2, '0')}:${(m || '00').padStart(2, '0')}:00+05:30`;
    const slotStartMs = new Date(slotStartIso).getTime();
    return nowMs >= slotStartMs + 10 * 60 * 1000;
  };

  // ===========================================================================
  // RENDER: Loading Phase
  // ===========================================================================
  if (phase === 'loading') {
    return (
      <div className="h-[100dvh] w-full bg-deep-forest text-white flex flex-col items-center justify-center p-6 select-none">
        <Loader2 className="w-8 h-8 animate-spin text-turmeric mb-4" />
        <h2 className="font-display text-lg text-white font-medium">{ct.loadingRoom}</h2>
        <p className="font-mono text-xs text-neutral-300 mt-1">VANKAL AYURVEDA · {ct.doctorName}</p>
      </div>
    );
  }

  // ===========================================================================
  // RENDER: Error / Not Found Phase
  // ===========================================================================
  if (phase === 'error') {
    return (
      <div className="h-[100dvh] w-full bg-cream text-deep-forest flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="w-14 h-14 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center mb-4">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="font-display text-xl sm:text-2xl text-deep-forest font-medium mb-2">
          {ct.endedTitle}
        </h2>
        <p className="font-body text-xs sm:text-sm text-ink/75 max-w-md mb-6">
          {errorMessage || ct.endedDesc}
        </p>
        <Button
          onClick={() => router.push('/book')}
          variant="primary"
          className="text-xs py-3 px-6 bg-forest text-sand hover:bg-deep-forest"
        >
          {ct.bookNew}
        </Button>
      </div>
    );
  }

  // ===========================================================================
  // RENDER: Patient Gate Phase (Identity Verification)
  // ===========================================================================
  if (phase === 'gate') {
    const isTooEarly = callStatus?.isTooEarly;

    return (
      <div className="min-h-[100dvh] w-full bg-[#fbf9f4] text-deep-forest flex flex-col items-center justify-center p-4 sm:p-6 select-none">
        <div className="w-full max-w-md bg-paper border border-forest/20 rounded-xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-forest/10 text-forest mx-auto flex items-center justify-center">
              <Lock className="w-6 h-6 text-forest" />
            </div>
            <h1 className="font-display text-xl sm:text-2xl text-deep-forest font-medium">
              {ct.gateTitle}
            </h1>
            <p className="font-body text-xs text-ink/70">
              {ct.gateSubtitle}
            </p>
          </div>

          {booking && (
            <div className="p-3 bg-forest/5 border border-forest/10 rounded-lg space-y-1 text-xs font-mono">
              <div className="flex justify-between text-ink/80">
                <span>{ct.slotLabel}:</span>
                <span className="font-semibold text-deep-forest">{booking.date} · {booking.slot}</span>
              </div>
              <div className="flex justify-between text-ink/80">
                <span>Doctor:</span>
                <span className="text-forest font-medium">{ct.doctorName}</span>
              </div>
            </div>
          )}

          {isTooEarly && (
            <div className="p-4 bg-turmeric/10 border border-turmeric/30 rounded-lg space-y-2 text-center">
              <Clock className="w-5 h-5 text-turmeric mx-auto" />
              <div className="font-display text-sm text-deep-forest font-medium">
                {ct.tooEarlyTitle}
              </div>
              <p className="text-[11px] font-mono text-ink/70">
                {ct.tooEarlyDesc}
              </p>
              {countdownStr && (
                <div className="font-mono text-base font-bold text-forest">
                  {ct.roomOpensIn}: {countdownStr}
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleVerifyPhone} className="space-y-4">
            <div>
              <label htmlFor="phoneLast4" className="flex items-center justify-between text-xs font-mono text-ink/80 font-medium mb-1.5">
                <span>{ct.phoneLast4Label}</span>
                {booking?.whatsappNumber && (
                  <button
                    type="button"
                    onClick={() => setPhoneLast4(booking.whatsappNumber.slice(-4))}
                    className="text-[11px] text-forest hover:underline font-semibold cursor-pointer"
                  >
                    (Expected: •••• {booking.whatsappNumber.slice(-4)} — Auto-fill)
                  </button>
                )}
              </label>
              <input
                id="phoneLast4"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                autoFocus
                placeholder={ct.phoneLast4Placeholder}
                value={phoneLast4}
                onChange={(e) => setPhoneLast4(e.target.value.replace(/\D/g, ''))}
                className="w-full text-center text-xl tracking-widest font-mono py-2.5 px-4 bg-sand/30 border border-forest/30 rounded-lg focus:outline-hidden focus:border-forest text-deep-forest"
              />
            </div>

            {gateError && (
              <div className="p-2.5 bg-terracotta/10 border border-terracotta/30 text-terracotta text-xs rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{gateError}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={isVerifying || phoneLast4.length !== 4}
              variant="primary"
              className="w-full py-3 bg-forest text-sand hover:bg-deep-forest text-xs font-medium cursor-pointer"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {ct.verifyingBtn}
                </>
              ) : (
                ct.verifyBtn
              )}
            </Button>
          </form>

          <div className="pt-2 flex items-center justify-between text-xs font-mono">
            <Link
              href="/"
              className="text-forest/70 hover:text-forest underline underline-offset-4"
            >
              ← {ct.returnHome}
            </Link>

            <a
              href={`/consult/${bookingId}?role=doctor`}
              className="text-forest hover:underline font-semibold"
            >
              Enter as Doctor →
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ===========================================================================
  // RENDER: Waiting Room Phase (Preview, Mic Meter, Device Selector)
  // ===========================================================================
  if (phase === 'waiting') {
    const isWindowActive =
      role === 'doctor' ||
      !callStatus ||
      Boolean(booking?.razorpayOrderId?.startsWith('order_test_')) ||
      booking?.isTestBooking ||
      process.env.NODE_ENV !== 'production' ||
      (!callStatus.isTooEarly && !callStatus.isEnded);

    return (
      <div className="min-h-[100dvh] w-full bg-[#fbf9f4] text-deep-forest flex flex-col p-4 sm:p-6 lg:p-8 select-none">
        {/* Top Header */}
        <header className="w-full max-w-4xl mx-auto flex items-center justify-between pb-4 border-b border-forest/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-forest text-sand flex items-center justify-center font-display text-sm font-semibold">
              VA
            </div>
            <div>
              <div className="font-display text-sm font-semibold text-deep-forest">
                VANKAL AYURVEDA
              </div>
              <div className="font-mono text-[10px] text-forest">
                {ct.doctorName} · {ct.doctorTitle}
              </div>
            </div>
          </div>
          <Badge variant="turmeric" className="text-[10px]">
            {role === 'doctor' ? 'Vaidya Session' : 'Patient Room'}
          </Badge>
        </header>

        {/* Main Waiting Room Content */}
        <main className="w-full max-w-4xl mx-auto flex-1 flex flex-col lg:flex-row gap-6 items-center justify-center py-6">
          {/* Left: Camera Preview Card */}
          <div className="w-full lg:w-3/5 space-y-3">
            <div className="relative aspect-video w-full bg-deep-forest rounded-xl overflow-hidden shadow-xl border border-forest/20 flex items-center justify-center">
              <video
                ref={previewVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />

              {permissionError && (
                <div className="absolute inset-0 bg-deep-forest/90 p-6 flex flex-col items-center justify-center text-center text-sand space-y-3 z-10">
                  <AlertCircle className="w-8 h-8 text-turmeric" />
                  <div className="font-display text-sm font-medium">{ct.permissionBlocked}</div>
                  <div className="font-body text-xs text-sand/80 max-w-xs space-y-1">
                    <p>{ct.permissionHelpChrome}</p>
                    <p>{ct.permissionHelpSafari}</p>
                  </div>
                  <Button
                    onClick={() => startMediaPreview(selectedCameraId, selectedMicId)}
                    variant="secondary"
                    className="text-xs py-2 px-4 bg-sand text-deep-forest hover:bg-sand/90"
                  >
                    <RefreshCw className="w-3.5 h-3.5 mr-2" />
                    Retry Permissions
                  </Button>
                </div>
              )}

              {/* Mic Level Indicator floating overlay */}
              <div className="absolute bottom-3 left-3 bg-deep-forest/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-sand/20 flex items-center gap-2 z-10">
                <Volume2 className="w-3.5 h-3.5 text-sand/80" />
                <div className="w-16 h-1.5 bg-sand/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-turmeric transition-all duration-75"
                    style={{ width: `${micLevel}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Checklist */}
            <div className="flex items-center justify-around p-3 bg-paper border border-forest/15 rounded-lg text-xs font-mono">
              <div className="flex items-center gap-1.5">
                {hasCameraPermission ? (
                  <CheckCircle2 className="w-4 h-4 text-forest" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-terracotta" />
                )}
                <span>{ct.cameraOk}</span>
              </div>
              <div className="w-px h-4 bg-forest/20" />
              <div className="flex items-center gap-1.5">
                {hasMicPermission ? (
                  <CheckCircle2 className="w-4 h-4 text-forest" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-terracotta" />
                )}
                <span>{ct.micOk}</span>
              </div>
            </div>
          </div>

          {/* Right: Slot Info, Hardware Selectors & Join Action */}
          <div className="w-full lg:w-2/5 space-y-5 bg-paper border border-forest/20 rounded-xl p-6 shadow-md">
            <div>
              <h2 className="font-display text-lg font-medium text-deep-forest">
                {ct.waitingRoomTitle}
              </h2>
              <p className="font-body text-xs text-ink/70 mt-0.5">
                {ct.waitingRoomSubtitle}
              </p>
            </div>

            {booking && (
              <div className="p-3 bg-forest/5 rounded-lg space-y-1.5 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-ink/60">Patient:</span>
                  <span className="font-semibold text-deep-forest">{booking.patientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink/60">{ct.slotLabel}:</span>
                  <span className="text-forest font-semibold">{booking.date} · {booking.slot}</span>
                </div>
              </div>
            )}

            {/* Hardware Selectors */}
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-mono text-ink/70 mb-1">{ct.camera}</label>
                <select
                  value={selectedCameraId}
                  onChange={(e) => setSelectedCameraId(e.target.value)}
                  className="w-full text-xs font-mono py-2 px-3 bg-sand/30 border border-forest/20 rounded-md focus:outline-hidden focus:border-forest text-deep-forest"
                >
                  {cameras.length > 0 ? (
                    cameras.map((c, i) => (
                      <option key={c.deviceId} value={c.deviceId}>
                        {c.label || `Camera ${i + 1}`}
                      </option>
                    ))
                  ) : (
                    <option value="">Default Camera</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-ink/70 mb-1">{ct.mic}</label>
                <select
                  value={selectedMicId}
                  onChange={(e) => setSelectedMicId(e.target.value)}
                  className="w-full text-xs font-mono py-2 px-3 bg-sand/30 border border-forest/20 rounded-md focus:outline-hidden focus:border-forest text-deep-forest"
                >
                  {mics.length > 0 ? (
                    mics.map((m, i) => (
                      <option key={m.deviceId} value={m.deviceId}>
                        {m.label || `Microphone ${i + 1}`}
                      </option>
                    ))
                  ) : (
                    <option value="">Default Microphone</option>
                  )}
                </select>
              </div>
            </div>

            {/* Join Button */}
            <div className="pt-2">
              <Button
                onClick={handleJoinCall}
                disabled={isJoining || !isWindowActive}
                variant="primary"
                className="w-full py-3.5 bg-forest text-sand hover:bg-deep-forest text-xs font-semibold cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isJoining ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {ct.joiningBtn}
                  </>
                ) : (
                  <>
                    <Video className="w-4 h-4 mr-2 text-turmeric" />
                    {ct.joinBtn}
                  </>
                )}
              </Button>
              {!isWindowActive && (
                <p className="text-[11px] font-mono text-terracotta text-center mt-2">
                  {callStatus?.isTooEarly ? ct.tooEarlyTitle : ct.endedTitle}
                </p>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ===========================================================================
  // RENDER: In-Call Phase (Full Viewport dvh, PiP, Controls Toolbar)
  // ===========================================================================
  if (phase === 'in_call') {
    return (
      <div className="h-[100dvh] w-full bg-[#07130e] text-white flex flex-col overflow-hidden relative select-none">
        {/* Top Floating Status Bar */}
        <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/85 via-black/50 to-transparent">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/80 backdrop-blur-md border border-emerald-500/40 text-xs font-mono text-emerald-300 shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-white">{formatTimer(elapsedSeconds)}</span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-xs font-mono text-neutral-200 border border-white/10">
              <Wifi className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {networkQuality <= 2
                  ? ct.qualityGood
                  : networkQuality <= 4
                  ? ct.qualityPoor
                  : ct.qualityBad}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-mono font-medium flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>{role === 'doctor' ? `Attending: ${ct.doctorName}` : booking?.patientName || 'Patient'}</span>
            </div>

            <a
              href={`/consult/${bookingId}?role=${role === 'doctor' ? 'patient' : 'doctor'}`}
              className="px-2.5 py-1 text-xs font-mono bg-white/10 hover:bg-white/20 text-neutral-200 border border-white/20 rounded-md cursor-pointer transition-colors font-medium flex items-center gap-1"
              title="Switch role for local dual-window testing"
            >
              <span>Switch to {role === 'doctor' ? 'Patient' : 'Doctor'}</span>
            </a>

            {role === 'doctor' && (
              <button
                onClick={() => setDoctorPanelOpen(!doctorPanelOpen)}
                className="px-3 py-1 text-xs font-mono bg-white/15 hover:bg-white/25 text-white border border-white/25 rounded-md cursor-pointer transition-colors font-medium flex items-center gap-1.5 shadow-sm"
                title="Toggle Patient Details Panel"
              >
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>{ct.patientDetails}</span>
              </button>
            )}
          </div>
        </header>

        {/* Temporary Notification Banner */}
        {statusBanner && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 px-4 py-2 bg-emerald-900 text-white text-xs font-mono rounded-full shadow-2xl border border-emerald-400/40 flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-medium">{statusBanner}</span>
          </div>
        )}

        {/* Connection State Warning Overlay */}
        {(connectionState === 'CONNECTING' || connectionState === 'RECONNECTING') && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 px-4 py-2.5 bg-amber-950/95 text-white text-xs font-mono rounded-lg shadow-2xl border border-amber-400/50 flex items-center gap-2.5">
            <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
            <span className="font-semibold text-amber-200">{ct.reconnecting}</span>
          </div>
        )}

        {/* Main Stage: Remote Video Stream */}
        <div className="flex-1 relative w-full h-full flex items-center justify-center overflow-hidden">
          {/* Remote Video Container */}
          <div
            ref={remoteVideoContainerRef}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              remoteVideoActive ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Fallback when Remote Video is Not Active */}
          {!remoteVideoActive && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-4 bg-gradient-to-b from-[#0a1e14] via-[#06140d] to-[#030906]">
              <div className="w-20 h-20 rounded-full bg-emerald-950/60 border-2 border-emerald-500/30 flex items-center justify-center shadow-xl">
                <Stethoscope className="w-10 h-10 text-amber-400" />
              </div>
              <div className="space-y-1.5 max-w-sm">
                <h3 className="font-display text-xl sm:text-2xl text-white font-medium tracking-tight">
                  {role === 'patient' ? ct.waitingForDoctor : ct.waitingForPatient}
                </h3>
                <p className="font-mono text-xs text-neutral-300">
                  {role === 'patient'
                    ? 'Dr. Lavesh Bohra has been notified and will enter shortly.'
                    : 'The patient room is ready. Waiting for patient to join.'}
                </p>
              </div>
              {booking?.slotStart && (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-mono text-neutral-200">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{booking.date} · {booking.slot}</span>
                </div>
              )}
            </div>
          )}

          {/* Local Video Stream: Picture-in-Picture (PiP) */}
          <div
            onClick={() => setIsPipSwapped(!isPipSwapped)}
            className="absolute bottom-24 right-4 sm:bottom-26 sm:right-6 w-28 h-40 sm:w-44 sm:h-60 rounded-xl overflow-hidden border-2 border-white/30 shadow-2xl z-20 bg-neutral-950 cursor-pointer group"
          >
            <div ref={localVideoContainerRef} className="w-full h-full object-cover" />
            {isVideoOff && (
              <div className="absolute inset-0 bg-neutral-900 flex flex-col items-center justify-center text-neutral-300">
                <VideoOff className="w-6 h-6 mb-1 text-red-400" />
                <span className="text-[10px] font-mono">Video Off</span>
              </div>
            )}
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/80 text-[10px] font-mono text-white border border-white/20">
              You {isMuted && '· Muted'}
            </div>
          </div>
        </div>

        {/* Doctor Clinical Profile Side Panel (Collapsible) */}
        {role === 'doctor' && doctorPanelOpen && booking && (
          <aside className="absolute top-14 bottom-26 right-4 z-40 w-full sm:w-88 bg-neutral-900/95 backdrop-blur-xl border border-white/15 rounded-2xl p-5 flex flex-col space-y-4 overflow-y-auto shadow-2xl text-white">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <span className="font-display text-sm text-white font-semibold">
                  {ct.patientDetails}
                </span>
              </div>
              <button
                onClick={() => setDoctorPanelOpen(false)}
                className="text-neutral-400 hover:text-white cursor-pointer p-1"
                aria-label="Close details"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="bg-black/50 p-3 rounded-lg border border-white/10 space-y-1">
                <span className="text-neutral-400 block text-[10px] uppercase tracking-wider font-semibold">Patient Name</span>
                <span className="font-bold text-sm text-white block">{booking.patientName}</span>
                <span className="text-neutral-300 text-[11px] block">WhatsApp: +91 {booking.whatsappNumber.slice(-10)}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-black/40 p-2.5 rounded-lg border border-white/10">
                  <span className="text-neutral-400 block text-[10px] uppercase font-semibold">Age</span>
                  <span className="font-semibold text-white">{booking.age} Years</span>
                </div>
                <div className="bg-black/40 p-2.5 rounded-lg border border-white/10">
                  <span className="text-neutral-400 block text-[10px] uppercase font-semibold">Gender</span>
                  <span className="font-semibold text-white">{booking.gender}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-neutral-400 block text-[10px] uppercase tracking-wider font-semibold">{ct.primaryComplaint}</span>
                <p className="font-body text-xs text-neutral-100 bg-black/50 p-3 rounded-lg leading-relaxed border border-white/10">
                  {booking.primaryComplaint || 'None provided'}
                </p>
              </div>

              <div className="space-y-1.5">
                <span className="text-neutral-400 block text-[10px] uppercase tracking-wider font-semibold">{ct.medicalReports}</span>
                {booking.reports && booking.reports.length > 0 ? (
                  <div className="space-y-1.5">
                    {booking.reports.map((report) => (
                      <a
                        key={report.id}
                        href={report.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-amber-300 transition-colors border border-white/10 font-medium"
                      >
                        <span className="truncate max-w-[200px] text-xs">{report.name}</span>
                        <ExternalLink className="w-3.5 h-3.5 shrink-0 ml-1 text-white" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <span className="text-neutral-400 italic block text-[11px]">{ct.noReports}</span>
                )}
              </div>
            </div>

            {/* Doctor Clinical Actions */}
            <div className="pt-3 border-t border-white/10 space-y-2 mt-auto">
              <Button
                onClick={handleDoctorEndCall}
                variant="primary"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs cursor-pointer shadow-md"
              >
                {ct.endConsultation}
              </Button>

              <Button
                onClick={handleDoctorNoShow}
                disabled={!isNoShowEligible()}
                variant="secondary"
                className="w-full py-2 bg-red-950/40 border border-red-500/40 text-red-300 hover:bg-red-900/50 text-xs font-medium cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                title={!isNoShowEligible() ? ct.noShowTooltip : ''}
              >
                {ct.markNoShow}
              </Button>
            </div>
          </aside>
        )}

        {/* Bottom Floating Control Bar */}
        <footer className="w-full h-24 bg-gradient-to-t from-black via-black/85 to-transparent flex items-center justify-center gap-3 sm:gap-6 px-4 z-30 pb-safe">
          {/* Mute Button */}
          <button
            onClick={toggleMute}
            aria-label={isMuted ? ct.unmuteMic : ct.muteMic}
            className={`w-13 h-13 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xl ${
              isMuted
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/50'
                : 'bg-white/20 hover:bg-white/30 text-white border-2 border-white/35 backdrop-blur-md'
            }`}
            title={isMuted ? ct.unmuteMic : ct.muteMic}
          >
            {isMuted ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
          </button>

          {/* Camera Button */}
          <button
            onClick={toggleVideo}
            aria-label={isVideoOff ? ct.startVideo : ct.stopVideo}
            className={`w-13 h-13 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xl ${
              isVideoOff
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/50'
                : 'bg-white/20 hover:bg-white/30 text-white border-2 border-white/35 backdrop-blur-md'
            }`}
            title={isVideoOff ? ct.startVideo : ct.stopVideo}
          >
            {isVideoOff ? <VideoOff className="w-6 h-6 text-white" /> : <Video className="w-6 h-6 text-white" />}
          </button>

          {/* Flip Camera (only if multiple cameras available) */}
          {cameras.length > 1 && (
            <button
              onClick={flipCamera}
              aria-label={ct.flipCamera}
              className="w-13 h-13 rounded-full bg-white/20 hover:bg-white/30 text-white border-2 border-white/35 flex items-center justify-center transition-all cursor-pointer shadow-xl backdrop-blur-md"
              title={ct.flipCamera}
            >
              <RefreshCw className="w-5 h-5 text-white" />
            </button>
          )}

          {/* Leave / End Button */}
          <button
            onClick={() => {
              if (window.confirm(ct.leaveConfirm)) {
                handleLeave();
              }
            }}
            aria-label={ct.leaveCall}
            className="w-16 h-13 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center transition-all cursor-pointer shadow-2xl ml-2 shadow-red-900/80"
            title={ct.leaveCall}
          >
            <PhoneOff className="w-6 h-6 text-white" />
          </button>
        </footer>
      </div>
    );
  }

  // ===========================================================================
  // RENDER: Ended Phase
  // ===========================================================================
  const canRejoin = callStatus ? !callStatus.isEnded : false;

  return (
    <div className="h-[100dvh] w-full bg-[#fbf9f4] text-deep-forest flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="w-full max-w-md bg-paper border border-forest/20 rounded-xl p-8 shadow-xl space-y-6">
        <div className="w-14 h-14 rounded-full bg-forest/10 text-forest flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8 text-forest" />
        </div>
        <div className="space-y-2">
          <h2 className="font-display text-2xl font-medium text-deep-forest">
            {ct.endedSummaryTitle}
          </h2>
          <p className="font-body text-xs sm:text-sm text-ink/75">
            {ct.endedSummaryDesc}
          </p>
        </div>

        {booking && (
          <div className="p-3 bg-forest/5 rounded-lg text-xs font-mono text-ink/70 space-y-1">
            <div>Patient: {booking.patientName}</div>
            <div>Doctor: {ct.doctorName}</div>
            {elapsedSeconds > 0 && <div>Call Duration: {formatTimer(elapsedSeconds)}</div>}
          </div>
        )}

        <div className="space-y-3 pt-2">
          {canRejoin && (
            <Button
              onClick={() => {
                setPhase('waiting');
              }}
              variant="primary"
              className="w-full py-3 bg-forest text-sand hover:bg-deep-forest text-xs font-medium cursor-pointer"
            >
              {ct.rejoinBtn}
            </Button>
          )}

          <Button
            onClick={() => router.push('/')}
            variant="secondary"
            className="w-full py-3 bg-sand text-deep-forest hover:bg-sand/80 text-xs font-medium cursor-pointer border border-forest/20"
          >
            {ct.returnHome}
          </Button>
        </div>
      </div>
    </div>
  );
}
