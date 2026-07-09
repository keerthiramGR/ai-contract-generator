from typing import Any, Generic, TypeVar, Optional
from pydantic import BaseModel

T = TypeVar("T")

class StandardResponse(BaseModel, Generic[T]):
    success: bool = True
    message: Optional[str] = None
    data: Optional[T] = None

def make_success_response(data: Any = None, message: Optional[str] = None) -> StandardResponse:
    """Helper to return standardized success formats."""
    return StandardResponse(success=True, message=message, data=data)
