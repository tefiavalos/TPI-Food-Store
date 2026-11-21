from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status

from app.core.deps import UsuarioAdmin
from app.modules.usuarios.schemas import UserPublic
from app.modules.usuarios.service import (
    AutoDesactivacion,
    UsuarioError,
    UsuarioNoEncontrado,
    UsuarioService,
)
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork

router = APIRouter(prefix="/admin/usuarios", tags=["Usuarios (admin)"])


def get_usuario_service() -> UsuarioService:
    return UsuarioService(UsuarioUnitOfWork())


ServiceDep = Annotated[UsuarioService, Depends(get_usuario_service)]


def _a_http(error: UsuarioError) -> HTTPException:
    if isinstance(error, UsuarioNoEncontrado):
        return HTTPException(status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    if isinstance(error, AutoDesactivacion):
        return HTTPException(status.HTTP_400_BAD_REQUEST, detail="No podés desactivar tu propia cuenta")
    return HTTPException(status.HTTP_400_BAD_REQUEST, detail=str(error))


@router.get("", response_model=list[UserPublic])
def listar_usuarios(_: UsuarioAdmin, service: ServiceDep) -> list[UserPublic]:
    return service.listar()


@router.post("/{usuario_id}/activar", response_model=UserPublic)
def activar_usuario(usuario_id: int, _: UsuarioAdmin, service: ServiceDep) -> UserPublic:
    try:
        return service.activar(usuario_id)
    except UsuarioError as e:
        raise _a_http(e)


@router.post("/{usuario_id}/desactivar", response_model=UserPublic)
def desactivar_usuario(usuario_id: int, admin: UsuarioAdmin, service: ServiceDep) -> UserPublic:
    try:
        return service.desactivar(usuario_id, admin_id=admin.id)
    except UsuarioError as e:
        raise _a_http(e)
