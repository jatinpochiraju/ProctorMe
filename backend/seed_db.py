import sys
sys.path.append('.')
from database import SessionLocal
import models

def seed():
    db = SessionLocal()
    
    # Check if exams already exist to prevent overwriting and data loss
    existing_exams = db.query(models.Exam).count()
    if existing_exams > 0:
        print("Exams already exist in the database. Skipping seed to preserve results.")
        db.close()
        return

    subjects = ["C", "Python", "Java", "JavaScript", "C++"]
    difficulties = ["Easy Level", "Medium Level", "Hard Level"]
    
    for subj in subjects:
        for diff in difficulties:
            questions = []
            for i in range(1, 11):
                # Unique questions
                questions.append({
                    "id": i,
                    "text": f"In {subj}, which of the following accurately describes a common {diff.split()[0]} scenario #{i}?",
                    "options": [
                        f"{subj} standard library method {i}",
                        f"A generic {diff} implementation",
                        f"An undefined behavior in {subj}",
                        "None of the above"
                    ],
                    "correct_option": i % 4
                })
            db.add(models.Exam(subject=subj, difficulty=diff, questions=questions))
    
    db.commit()
    db.close()
    print("Successfully seeded 15 distinct exams with completely unique questions.")

if __name__ == "__main__":
    seed()
