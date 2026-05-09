import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import * as tf from '@tensorflow/tfjs';
import * as blazeface from '@tensorflow-models/blazeface';
import ProctorService from '../proctoring/ProctorService';

function Exam() {
  const { examId } = useParams();
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(30 * 60); 
  const [violations, setViolations] = useState([]);
  const [popup, setPopup] = useState(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [faces, setFaces] = useState([]);
  const [hasStarted, setHasStarted] = useState(false);
  
  const token = useSelector(state => state.auth.token);
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const proctorRef = useRef(null);
  const detectionInterval = useRef(null);
  const [flagged, setFlagged] = useState(false);
  
  useEffect(() => {
    // Fetch the exam from the backend
    if (examId !== 'mock') {
      axios.get(`http://localhost:8000/exam/${examId}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => setExam(res.data)).catch(console.error);
    } else {
      setExam({
        subject: 'JAVA',
        difficulty: 'Easy Level',
        questions: Array(10).fill(0).map((_, i) => ({
          id: i,
          text: `What is the correct way to declare a String in Java? (Mock ${i})`,
          options: ['String str = "Hello";', 'string str = "Hello";', "String str = 'Hello';", 'Str str = "Hello";']
        }))
      });
    }
  }, [examId, token]);

  useEffect(() => {
    if (!hasStarted) return;
    if (timeLeft <= 0 && exam) handleSubmit(true);
    const timerId = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, exam, hasStarted]);

  useEffect(() => {
    // We must wait for `exam` and `hasStarted` so that videoRef is mounted in the DOM
    if (!exam || !hasStarted || !videoRef.current) return;

    let model;
    const loadModel = async () => {
      await tf.ready();
      model = await blazeface.load();
      startDetection();
    };

    const startDetection = () => {
      let gazeAwayFrames = 0;
      let multipleFacesFrames = 0;
      detectionInterval.current = setInterval(async () => {
        if (videoRef.current && videoRef.current.readyState === 4) {
          try {
            const predictions = await model.estimateFaces(videoRef.current, false);
            if (predictions.length > 0) {
              if (predictions.length > 1) {
                multipleFacesFrames++;
                if (multipleFacesFrames > 5) {
                  handleViolation("MULTIPLE_FACES");
                  multipleFacesFrames = 0;
                }
              } else {
                multipleFacesFrames = 0;
              }
              
              const pred = predictions[0];
              
              // Real Eye Gaze / Head Pose Detection
              if (pred.landmarks && pred.landmarks.length >= 3) {
                const leftEye = pred.landmarks[0];
                const rightEye = pred.landmarks[1];
                const nose = pred.landmarks[2];
                const eyeWidth = Math.abs(rightEye[0] - leftEye[0]);
                const noseOffset = (nose[0] - leftEye[0]) / (rightEye[0] - leftEye[0]);

                // If nose is too far to one side relative to eyes, they are looking away
                if (noseOffset < 0.25 || noseOffset > 0.75) {
                  gazeAwayFrames++;
                  if (gazeAwayFrames > 10) { // Sustained for ~1.5 seconds
                    handleViolation("EYE_GAZE_AWAY");
                    gazeAwayFrames = 0;
                  }
                } else {
                  gazeAwayFrames = 0;
                }
              }

              const vw = videoRef.current.videoWidth;
              const vh = videoRef.current.videoHeight;
              
              const mappedFaces = predictions.map(p => {
                const start = p.topLeft;
                const end = p.bottomRight;
                const size = [end[0] - start[0], end[1] - start[1]];
                
                const xPercent = (1 - (start[0] + size[0]) / vw) * 100;
                const yPercent = (start[1] / vh) * 100;
                const widthPercent = (size[0] / vw) * 100;
                const heightPercent = (size[1] / vh) * 100;
                
                return { x: xPercent, y: yPercent, width: widthPercent, height: heightPercent };
              });
              setFaces(mappedFaces);
            } else {
              setFaces([]);
              // If no face is detected for too long
              gazeAwayFrames++;
              if (gazeAwayFrames > 20) {
                handleViolation("NO_FACE");
                gazeAwayFrames = 0;
              }
            }
          } catch(e) { console.error("Detection error", e); }
        }
      }, 150);
    };

    const startProctoring = async () => {
      proctorRef.current = new ProctorService(videoRef.current, handleViolation);
      await proctorRef.current.start();
      loadModel();
    };
    
    startProctoring();
    
    return () => {
      if (proctorRef.current) proctorRef.current.stop();
      if (detectionInterval.current) clearInterval(detectionInterval.current);
    };
  }, [exam, hasStarted]); // Dependency on exam and hasStarted ensures it runs AFTER loading UI is gone

  const handleViolation = (type) => {
    setViolations(prev => {
      const newV = [...prev, { type, timestamp: new Date().toISOString() }];
      
      let title = 'Violation Detected';
      let sub = 'Action has been Recorded';

      if (type === 'TAB_SWITCH') { title = 'Tab Switch Detected'; sub = 'Returning to the exam is required'; }
      if (type === 'AUDIO_ALERT') { title = 'Abnormal Sound Detected'; sub = 'Background noise was logged'; }
      if (type === 'WINDOW_FOCUS_LOST') { title = 'Window Focus Lost'; sub = 'Stay focused on the exam window'; }
      if (type === 'FULLSCREEN_EXIT') { title = 'Fullscreen Exit Detected'; sub = 'Please return to fullscreen mode'; }
      if (type === 'EYE_GAZE_AWAY') { title = 'Eye Gaze Violation'; sub = 'Please keep your eyes focused on the screen and camera'; }
      if (type === 'NO_FACE') { title = 'No Face Detected'; sub = 'Your face must be clearly visible in the camera'; }
      if (type === 'MULTIPLE_FACES') { title = 'Multiple Faces Detected'; sub = 'Only one person is allowed in the camera view'; }
      
      setPopup({ title, sub });

      // Auto-submit at > 10 violations exactly
      if (newV.length > 10 && !flagged) {
        setFlagged(true);
        handleSubmit(true, newV);
      }
      return newV;
    });
  };

  const closePopup = () => {
    setPopup(null);
    if (flagged) alert("Exam submitted due to max violations.");
  };

  const handleSubmit = async (auto = false, currentViolations = violations) => {
    if (proctorRef.current) proctorRef.current.stop();
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(console.error);
    }
    const isFlagged = currentViolations.length > 10;
    try {
      const res = await axios.post('http://localhost:8000/exam/submit', {
        exam_id: parseInt(examId) || 1,
        answers,
        timeTakenSeconds: 30 * 60 - timeLeft,
        violationCount: currentViolations.length,
        violations: currentViolations,
        flagged: isFlagged
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Redirect to the specific result page!
      navigate(`/summary/${res.data.result_id}`);
    } catch (err) {
      console.error("Submission error:", err);
      alert("Failed to submit exam: " + (err.response?.data?.detail || err.message || err.toString()));
      navigate('/results'); // Fallback
    }
  };

  const handleStartExam = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
      setHasStarted(true);
    } catch (e) {
      alert("Please allow fullscreen mode to start the exam.");
    }
  };

  if (!exam) return <div style={{ padding: '40px', fontSize: '20px', color: '#2a3547' }}>Loading exam environment...</div>;

  if (!hasStarted) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', background: '#fafbfc', minHeight: 'calc(100vh - 64px)' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <h2 style={{ fontSize: '24px', color: '#2a3547', marginBottom: '20px' }}>Ready to Start?</h2>
          <p style={{ color: '#5a6a85', marginBottom: '30px', lineHeight: '1.6' }}>
            This exam is proctored. You must grant camera and microphone access. 
            The exam will be administered in <strong>Fullscreen Mode</strong>. Exiting fullscreen will be recorded as a violation.
          </p>
          <button 
            onClick={handleStartExam}
            style={{ background: '#5d87ff', color: 'white', border: 'none', padding: '14px 40px', fontSize: '16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
          >
            Enter Fullscreen & Start Exam
          </button>
        </div>
      </div>
    );
  }

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const currentQ = exam.questions[currentQIndex];

  return (
    <div style={{ margin: '-24px', padding: '40px', position: 'relative', background: '#fafbfc', minHeight: 'calc(100vh - 64px)', fontFamily: "'Inter', sans-serif" }}>
      {popup && (
        <div className="overlay" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>
          <div className="popup" style={{ width: '450px', padding: '40px', borderRadius: '16px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '3px solid #ff9f43', color: '#ff9f43', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', margin: '0 auto 20px' }}>
              !
            </div>
            <h2 style={{ marginBottom: '10px', color: '#2a3547', fontSize: '22px', fontWeight: '700' }}>{popup.title}</h2>
            <p style={{ color: '#5a6a85', marginBottom: '30px', fontSize: '15px' }}>{popup.sub}</p>
            <button className="btn" onClick={closePopup} style={{ background: '#5d87ff', color: 'white', padding: '12px 30px', fontSize: '15px', borderRadius: '8px', width: '100%', fontWeight: '600' }}>Acknowledge & Continue</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '30px', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Left Side: Question */}
        <div style={{ flex: 1, background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
             <div style={{ width: '40px', height: '40px', background: '#eef2ff', color: '#5d87ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '16px' }}>
               Q{currentQIndex + 1}
             </div>
             <h3 style={{ fontSize: '18px', color: '#2a3547', margin: 0, fontWeight: '600' }}>Question {currentQIndex + 1} of {exam.questions.length}</h3>
          </div>
          
          <p style={{ fontSize: '16px', marginBottom: '40px', color: '#2a3547', lineHeight: '1.6' }}>{currentQ.text}</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {currentQ.options.map((opt, oIdx) => (
              <label key={oIdx} style={{ 
                display: 'flex', alignItems: 'center', gap: '15px', fontSize: '15px', cursor: 'pointer', color: '#2a3547',
                padding: '16px 20px', border: answers[currentQ.id] === oIdx ? '2px solid #5d87ff' : '1px solid #dfe5ef', borderRadius: '12px',
                background: answers[currentQ.id] === oIdx ? '#f4f6f9' : 'white', transition: 'all 0.2s'
              }}>
                <input 
                  type="radio" 
                  name={`q_${currentQ.id}`} 
                  value={oIdx} 
                  onChange={() => setAnswers({...answers, [currentQ.id]: oIdx})}
                  checked={answers[currentQ.id] === oIdx}
                  style={{ width: '20px', height: '20px', margin: 0, accentColor: '#5d87ff' }}
                />
                {opt}
              </label>
            ))}
          </div>
          
          {/* Navigation Arrows */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', paddingTop: '30px', borderTop: '1px solid #dfe5ef' }}>
            <button 
              className="btn" 
              onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQIndex === 0}
              style={{ background: currentQIndex === 0 ? '#f4f6f9' : '#fff', color: currentQIndex === 0 ? '#8e9ab5' : '#5d87ff', border: currentQIndex === 0 ? 'none' : '1px solid #5d87ff', padding: '10px 24px', borderRadius: '8px', cursor: currentQIndex === 0 ? 'not-allowed' : 'pointer', fontWeight: '600' }}
            >
              ← Previous
            </button>
            <button 
              className="btn" 
              onClick={() => setCurrentQIndex(prev => Math.min(exam.questions.length - 1, prev + 1))}
              disabled={currentQIndex === exam.questions.length - 1}
              style={{ background: currentQIndex === exam.questions.length - 1 ? '#f4f6f9' : '#5d87ff', color: currentQIndex === exam.questions.length - 1 ? '#8e9ab5' : 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: currentQIndex === exam.questions.length - 1 ? 'not-allowed' : 'pointer', fontWeight: '600' }}
            >
              Next →
            </button>
          </div>
        </div>

        {/* Right Side: Sidebar Panel */}
        <div style={{ width: '380px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Header Stats */}
          <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                 <p style={{ margin: '0 0 5px 0', fontSize: '13px', color: '#8e9ab5' }}>Time Remaining</p>
                 <div style={{ fontSize: '24px', fontWeight: '700', color: timeLeft < 300 ? '#fa896b' : '#2a3547' }}>{mins}:{secs < 10 ? '0' : ''}{secs}</div>
              </div>
              <button className="btn" style={{ background: '#fa896b', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '600' }} onClick={() => handleSubmit(false)}>Finish Test</button>
            </div>
          </div>

          {/* Question Grid */}
          <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <p style={{ margin: '0 0 15px 0', fontSize: '14px', fontWeight: '600', color: '#2a3547' }}>Question Navigator</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
              {exam.questions.map((q, idx) => (
                <button 
                  key={q.id} 
                  onClick={() => setCurrentQIndex(idx)}
                  style={{
                    background: currentQIndex === idx ? '#5d87ff' : (answers[q.id] !== undefined ? '#eef2ff' : '#f4f6f9'),
                    color: currentQIndex === idx ? 'white' : (answers[q.id] !== undefined ? '#5d87ff' : '#5a6a85'),
                    border: currentQIndex === idx ? 'none' : (answers[q.id] !== undefined ? '1px solid #5d87ff' : '1px solid #dfe5ef'),
                    borderRadius: '8px',
                    padding: '12px 0',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '14px',
                    transition: 'all 0.2s'
                  }}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Camera Feed */}
          <div style={{ background: 'white', padding: '16px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', position: 'relative' }}>
            <p style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: '600', color: '#8e9ab5', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', background: '#13deb9', borderRadius: '50%', display: 'inline-block' }}></span> Live Proctoring
            </p>
            <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', background: '#000', width: '100%', aspectRatio: '4/3' }}>
               <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
               
               {/* Dynamic Red Face Detection Bounding Box Overlays */}
               {faces.map((face, index) => (
                 <div key={index} style={{
                   position: 'absolute',
                   top: `${face.y}%`,
                   left: `${face.x}%`,
                   width: `${face.width}%`,
                   height: `${face.height}%`,
                   border: '2px solid #a31d32',
                   borderRadius: '2px',
                   pointerEvents: 'none',
                   boxShadow: '0 0 0 1px rgba(0,0,0,0.1)',
                   transition: 'all 0.1s linear'
                 }}>
                   <span style={{
                     position: 'absolute',
                     top: '-20px',
                     left: '-2px',
                     color: '#a31d32',
                     fontSize: '12px',
                     fontWeight: '600',
                     letterSpacing: '0.5px',
                     background: 'rgba(255,255,255,0.8)',
                     padding: '0 4px',
                     borderRadius: '2px'
                   }}>
                     person
                   </span>
                 </div>
               ))}
            </div>

            {/* Proctoring Parameters Display */}
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px', background: '#f4f6f9', padding: '12px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#5a6a85', fontWeight: '500' }}>
                <span>📷 Webcam & Gaze</span>
                <span style={{ color: '#13deb9', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                   <span style={{ width: '6px', height: '6px', background: '#13deb9', borderRadius: '50%', display: 'inline-block' }}></span> Active
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#5a6a85', fontWeight: '500' }}>
                <span>🖥️ Window & Focus</span>
                <span style={{ color: '#13deb9', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                   <span style={{ width: '6px', height: '6px', background: '#13deb9', borderRadius: '50%', display: 'inline-block' }}></span> Active
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#5a6a85', fontWeight: '500' }}>
                <span>🎤 Sound Detection</span>
                <span style={{ color: '#13deb9', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                   <span style={{ width: '6px', height: '6px', background: '#13deb9', borderRadius: '50%', display: 'inline-block' }}></span> Active
                </span>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default Exam;
