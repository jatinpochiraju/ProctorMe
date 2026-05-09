import sys
sys.path.append('.')
from database import SessionLocal
import models
import datetime

def seed_results():
    db = SessionLocal()
    
    student = db.query(models.User).filter(models.User.email == "np8781@srmist.edu.in").first()
    exam = db.query(models.Exam).first()
    
    if student and exam:
        # Create a flagged result
        flagged_result = models.Result(
            user_id=student.id,
            exam_id=exam.id,
            answers={"1": 1, "2": 2},
            score=2,
            timeTakenSeconds=120,
            violationCount=7,
            violations=[{"type": "no face", "timestamp": "00:10"}],
            flagged=True,
            created_at=datetime.datetime.utcnow()
        )
        db.add(flagged_result)
        db.commit()
        print("Added a mocked flagged result for the student.")
    else:
        print("Student or exam not found.")

if __name__ == "__main__":
    seed_results()
