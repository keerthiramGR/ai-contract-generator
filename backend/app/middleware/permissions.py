from fastapi import Depends, HTTPException, status
from app.core.auth import get_current_user
from app.models.profile import Profile, UserRole
from typing import List

class RoleChecker:
    def __init__(self, allowed_roles: List[UserRole]):
        self.allowed_roles = allowed_roles

    def __call__(self, current_user: Profile = Depends(get_current_user)) -> Profile:
        """Assert current authenticated user belongs to allowed roles."""
        if current_user.role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to access this resource."
            )
        return current_user

# Predefined role dependencies
require_super_admin = RoleChecker([UserRole.SUPER_ADMIN])
require_company_admin = RoleChecker([UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN])
require_user = RoleChecker([UserRole.USER, UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN])
