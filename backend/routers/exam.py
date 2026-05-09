from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import models, schemas, database
from routers.auth import get_current_user
import json

router = APIRouter()

@router.get("/available")
def get_available_exams(db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    exams = db.query(models.Exam).all()
    return exams

@router.get("/{exam_id}", response_model=schemas.ExamSchema)
def start_exam(exam_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    exam = db.query(models.Exam).filter(models.Exam.id == exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    
    # Hide correct answers
    q_safe = []
    for q in exam.questions:
        q_safe.append({"id": q["id"], "text": q["text"], "options": q["options"]})
    
    return {"id": exam.id, "subject": exam.subject, "difficulty": exam.difficulty, "questions": q_safe}

@router.post("/submit")
def submit_exam(submission: schemas.ExamSubmit, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):

    try:
        exam = db.query(models.Exam).filter(models.Exam.id == submission.exam_id).first()
        if not exam:
            raise HTTPException(status_code=404, detail="Exam not found")

        score = 0
        for q in exam.questions:
            qid = str(q["id"])
            if qid in submission.answers and submission.answers[qid] == q["correct_option"]:
                score += 1

        result = models.Result(
            user_id=current_user.id,
            exam_id=submission.exam_id,
            answers=submission.answers,
            score=score,
            timeTakenSeconds=submission.timeTakenSeconds,
            violationCount=submission.violationCount,
            violations=submission.violations,
            flagged=submission.flagged
        )
        db.add(result)
        db.commit()
        db.refresh(result)
        return {"message": "Submitted successfully", "result_id": result.id}
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/results/{result_id}")
def get_result(result_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    result = db.query(models.Result).filter(models.Result.id == result_id).first()
    if not result or (result.user_id != current_user.id and current_user.role != "admin"):
        raise HTTPException(status_code=403, detail="Not authorized")
    
    exam = db.query(models.Exam).filter(models.Exam.id == result.exam_id).first()
    
    return {
        "score": result.score,
        "timeTakenSeconds": result.timeTakenSeconds,
        "violationCount": result.violationCount,
        "violations": result.violations,
        "flagged": result.flagged,
        "exam_subject": exam.subject,
        "difficulty": exam.difficulty,
        "questions": exam.questions,
        "answers": result.answers
    }
