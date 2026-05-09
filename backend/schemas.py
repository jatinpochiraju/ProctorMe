from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import datetime

class UserBase(BaseModel):
    email: str
    name: str

class UserCreate(UserBase):
    password: str
    role: Optional[str] = "student"

class User(UserBase):
    id: int
    role: str

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str

class TokenData(BaseModel):
    email: Optional[str] = None

class QuestionSchema(BaseModel):
    id: int
    text: str
    options: List[str]
    correct_option: int

class ExamSchema(BaseModel):
    id: int
    subject: str
    difficulty: str
    questions: List[dict]

    class Config:
        from_attributes = True

class ExamSubmit(BaseModel):
    exam_id: int
    answers: dict
    timeTakenSeconds: int
    violationCount: int
    violations: List[dict]
    flagged: bool

class ResultSchema(BaseModel):
    id: int
    user_id: int
    exam_id: int
    answers: dict
    score: int
    timeTakenSeconds: int
    violationCount: int
    violations: List[dict]
    flagged: bool
    created_at: datetime

    class Config:
        from_attributes = True
