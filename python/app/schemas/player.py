from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, field_validator


class PlayerCreateSchema(BaseModel):
    """Schema for creating a new player"""

    first_name: str = Field(..., min_length=1, max_length=100, alias="firstName", description="Player's first name")
    last_name: str = Field(..., min_length=1, max_length=100, alias="lastName", description="Player's last name")
    phone_number: str = Field(..., min_length=10, max_length=20, alias="phoneNumber", description="Player's phone number")

    @field_validator("phone_number")
    @classmethod
    def validate_phone_number(cls, v: str) -> str:
        """Validate phone number format"""
        # Remove common separators
        cleaned = v.replace("-", "").replace(" ", "").replace("(", "").replace(")", "").replace("+", "")
        if not cleaned.isdigit():
            raise ValueError("Phone number must contain only digits and common separators")
        if len(cleaned) < 10:
            raise ValueError("Phone number must be at least 10 digits")
        return v

    class Config:
        populate_by_name = True  # Allow both firstName and first_name
        json_schema_extra = {
            "example": {
                "firstName": "John",
                "lastName": "Doe",
                "phoneNumber": "555-123-4567",
            }
        }


class PlayerResponseSchema(BaseModel):
    """Schema for player responses"""

    id: int
    first_name: str = Field(..., alias="firstName")
    last_name: str = Field(..., alias="lastName")
    phone_number: str = Field(..., alias="phoneNumber")
    created_at: datetime = Field(..., alias="createdAt")
    updated_at: datetime = Field(..., alias="updatedAt")

    class Config:
        from_attributes = True  # Allow ORM model conversion
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "id": 1,
                "firstName": "John",
                "lastName": "Doe",
                "phoneNumber": "555-123-4567",
                "createdAt": "2024-01-01T12:00:00",
                "updatedAt": "2024-01-01T12:00:00",
            }
        }


class PlayerUpdateSchema(BaseModel):
    """Schema for updating a player"""

    first_name: Optional[str] = Field(None, min_length=1, max_length=100, alias="firstName")
    last_name: Optional[str] = Field(None, min_length=1, max_length=100, alias="lastName")
    phone_number: Optional[str] = Field(None, min_length=10, max_length=20, alias="phoneNumber")

    @field_validator("phone_number")
    @classmethod
    def validate_phone_number(cls, v: Optional[str]) -> Optional[str]:
        """Validate phone number format"""
        if v is None:
            return v
        cleaned = v.replace("-", "").replace(" ", "").replace("(", "").replace(")", "").replace("+", "")
        if not cleaned.isdigit():
            raise ValueError("Phone number must contain only digits and common separators")
        if len(cleaned) < 10:
            raise ValueError("Phone number must be at least 10 digits")
        return v

    class Config:
        populate_by_name = True