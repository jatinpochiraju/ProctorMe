import sys
sys.path.append('backend')
from backend.database import SessionLocal
import backend.models as models
import backend.schemas as schemas
from backend.routers.exam import submit_exam
from backend.routers.auth import get_current_user

db = SessionLocal()
user = db.query(models.User).filter(models.User.email == "np8781@srmist.edu.in").first()

sub = schemas.ExamSubmit(
    exam_id=1,
    answers={"1": 0},
    timeTakenSeconds=100,
    violationCount=0,
    violations=[],
    flagged=False
)

try:
    res = submit_exam(submission=sub, db=db, current_user=user)
    print("Success:", res)
except Exception as e:
    import traceback
    traceback.print_exc()
