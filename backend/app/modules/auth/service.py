from fastapi import HTTPException, status

from app.core.deps import CUENTA_DESACTIVADA
from app.core.security import create_access_token, hash_password, verify_password
from app.modules.usuarios.models import Usuario
from app.modules.usuarios.schemas import UserCreate, UserPublic
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork


class AuthService:
    def __init__(self, uow: UsuarioUnitOfWork) -> None:
        self.uow = uow

    def registrar(self, data: UserCreate) -> UserPublic:
        with self.uow as uow:
            if uow.usuarios.get_by_username(data.username) is not None:
                raise HTTPException(status.HTTP_409_CONFLICT, detail="El nombre de usuario ya existe")
            if uow.usuarios.get_by_email(data.email) is not None:
                raise HTTPException(status.HTTP_409_CONFLICT, detail="El email ya está registrado")
            usuario = Usuario(
                username=data.username,
                full_name=data.full_name,
                email=data.email,
                hashed_password=hash_password(data.password),
                role="user",
            )
            uow.usuarios.add(usuario)
            return UserPublic.model_validate(usuario)

    def login(self, username: str, password: str) -> str:
        with self.uow as uow:
            usuario = uow.usuarios.get_by_username(username)
            if usuario is None or not verify_password(password, usuario.hashed_password):
                raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="Usuario o contraseña incorrectos")
            if usuario.disabled:
                raise HTTPException(status.HTTP_400_BAD_REQUEST, detail=CUENTA_DESACTIVADA)
            return create_access_token(data={"sub": usuario.username, "role": usuario.role})
