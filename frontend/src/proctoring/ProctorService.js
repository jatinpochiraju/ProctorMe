// Basic lightweight proctoring service
// Features: Tab switch, Face validation mockup, Audio anomaly mockup

class ProctorService {
  constructor(videoElement, onViolation) {
    this.videoElement = videoElement;
    this.onViolation = onViolation;
    this.stream = null;
    this.audioContext = null;
    this.isMonitoring = false;
    this.tabListener = this.handleVisibilityChange.bind(this);
  }

  async start() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (this.videoElement) {
        this.videoElement.srcObject = this.stream;
        try {
          await this.videoElement.play();
        } catch(e) {
          console.warn("Video auto-play policy prevented playback", e);
        }
      }
      this.isMonitoring = true;
      
      // Tab and Window App Switching Detection
      document.addEventListener('visibilitychange', this.tabListener);
      
      this.blurListener = () => {
        if (this.isMonitoring) this.onViolation("WINDOW_FOCUS_LOST");
      };
      window.addEventListener('blur', this.blurListener);

      // Fullscreen Exit Detection
      this.fullscreenListener = () => {
        if (!document.fullscreenElement && this.isMonitoring) {
          this.onViolation("FULLSCREEN_EXIT");
        }
      };
      document.addEventListener('fullscreenchange', this.fullscreenListener);
      
      // Setup audio monitoring
      this.setupAudioMonitoring();
    } catch (err) {
      console.error("Camera/Mic access denied", err);
      this.onViolation("NO_CAMERA_MIC_ACCESS");
    }
  }

  setupAudioMonitoring() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyzer = this.audioContext.createAnalyser();
      const microphone = this.audioContext.createMediaStreamSource(this.stream);
      microphone.connect(analyzer);
      
      analyzer.fftSize = 512;
      analyzer.smoothingTimeConstant = 0.8;
      const bufferLength = analyzer.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      let sustainedLoudCount = 0;
      let noiseFloor = 20; // Dynamic baseline

      // Check every 200ms for better responsiveness
      this.audioInterval = setInterval(() => {
        if (!this.isMonitoring) return;
        
        analyzer.getByteFrequencyData(dataArray);
        
        // Calculate energy in human speech frequencies (approx 300Hz - 3000Hz)
        // With 512 FFT and 44.1k/48k sample rate, each bin is ~90-100Hz.
        // Bins 3 to 30 roughly cover the speech range.
        let speechEnergy = 0;
        for(let i = 3; i < 30; i++) {
          speechEnergy += dataArray[i];
        }
        let averageSpeechEnergy = speechEnergy / 27;

        // Dynamic noise floor adjustment (slowly follows background hum)
        if (averageSpeechEnergy < noiseFloor) {
          noiseFloor = (noiseFloor * 0.95) + (averageSpeechEnergy * 0.05);
        } else {
          noiseFloor = (noiseFloor * 0.99) + (averageSpeechEnergy * 0.01);
        }

        // Detect anomaly: Significant jump above current noise floor
        if (averageSpeechEnergy > noiseFloor + 50) {
          sustainedLoudCount++;
          // Trigger violation if noise is sustained for ~3 seconds (15 samples * 200ms)
          if (sustainedLoudCount >= 15) {
            this.onViolation("AUDIO_ALERT");
            sustainedLoudCount = 0;
          }
        } else {
          sustainedLoudCount = Math.max(0, sustainedLoudCount - 1);
        }
      }, 200);
    } catch(e) {
      console.warn("Audio Context setup failed", e);
    }
  }

  handleVisibilityChange() {
    if (document.hidden && this.isMonitoring) {
      this.onViolation("TAB_SWITCH");
    }
  }

  stop() {
    this.isMonitoring = false;
    document.removeEventListener('visibilitychange', this.tabListener);
    window.removeEventListener('blur', this.blurListener);
    document.removeEventListener('fullscreenchange', this.fullscreenListener);
    
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
    if (this.audioInterval) clearInterval(this.audioInterval);
    if (this.audioContext) this.audioContext.close();
  }
}

export default ProctorService;
