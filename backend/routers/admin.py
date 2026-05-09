from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import PlainTextResponse, StreamingResponse
from sqlalchemy.orm import Session
import models, schemas, database
from routers.auth import get_current_user
import io

router = APIRouter()

def check_admin(user: models.User):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin only")

@router.get("/results")
def get_all_results(db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    check_admin(current_user)
    results = db.query(models.Result).all()
    res_list = []
    for r in results:
        res_list.append({
            "id": r.id,
            "user": r.user.email,
            "exam": r.exam.subject,
            "score": r.score,
            "flagged": r.flagged,
            "violations": r.violationCount
        })
    return res_list

@router.get("/report/txt/{result_id}")
def download_report_txt(result_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    result = db.query(models.Result).filter(models.Result.id == result_id).first()
    if not result:
        raise HTTPException(status_code=404)
    if current_user.role != "admin" and result.user_id != current_user.id:
        raise HTTPException(status_code=403)
    
    content = f"ProctorMe Exam Report\n"
    content += f"====================\n"
    content += f"User: {result.user.name} ({result.user.email})\n"
    content += f"Exam: {result.exam.subject} - {result.exam.difficulty}\n"
    content += f"Score: {result.score} / {len(result.exam.questions)}\n"
    content += f"Time Taken: {result.timeTakenSeconds} seconds\n"
    content += f"Violations: {result.violationCount}\n"
    content += f"Status: {'Malpractice' if result.flagged else 'Clear'}\n\n"
    content += f"Violation Details:\n"
    for v in result.violations:
        content += f"- {v.get('type')} at {v.get('timestamp')}\n"
        
    return PlainTextResponse(content, media_type="text/plain", headers={"Content-Disposition": f"attachment; filename=report_{result_id}.txt"})

@router.get("/report/pdf/{result_id}")
def download_report_pdf(result_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    check_admin(current_user)
    # Simple mockup for PDF (returns txt as pdf stream for demo)
    result = db.query(models.Result).filter(models.Result.id == result_id).first()
    content = f"PDF Report for {result.user.email} - Score: {result.score}".encode("utf-8")
    return StreamingResponse(io.BytesIO(content), media_type="application/pdf", headers={"Content-Disposition": f"attachment; filename=report_{result_id}.pdf"})
