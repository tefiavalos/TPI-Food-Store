from typing import Annotated

from fastapi import APIRouter, Depends, Response, status
from fastapi.security import OAuth2PasswordRequestForm

from app.core.config import settings
from app.core.deps import UsuarioActivo
from app.modules.auth.schemas import MensajeRespuesta
from app.modules.auth.service import AuthService
from app.modules.usuarios.schemas import UserCreate, UserPublic
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork

router = APIRouter(prefix="/auth", tags=["Autenticación"])

COOKIE_NAME = "access_token"


def get_auth_service() -> AuthService:
    return AuthService(UsuarioUnitOfWork())


ServiceDep = Annotated[AuthService, Depends(get_auth_service)]


@router.post("/register", response_model=UserPublic, status_code=status.HTTP_201_CREATED)
def register(data: UserCreate, service: ServiceDep) -> UserPublic:
    return service.registrar(data)


@router.post("/token", response_model=MensajeRespuesta)
def login(
    response: Response,
    form: Annotated[OAuth2PasswordRequestForm, Depends()],
    service: ServiceDep,
) -> MensajeRespuesta:
    token = service.login(form.username, form.password)
    response.set_cookie(
        key=COOKIE_NAME,
        value=token,
        httponly=True,
        samesite="lax",
        secure=False,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/",
    )
    return MensajeRespuesta(message="Login exitoso")


@router.post("/logout", response_model=MensajeRespuesta)
def logout(response: Response) -> MensajeRespuesta:
    response.delete_cookie(
        key=COOKIE_NAME,
        httponly=True,
        samesite="lax",
        secure=False,
        path="/",
    )
    return MensajeRespuesta(message="Sesión cerrada")


@router.get("/me", response_model=UserPublic)
def me(usuario: UsuarioActivo) -> UserPublic:
    return usuario
