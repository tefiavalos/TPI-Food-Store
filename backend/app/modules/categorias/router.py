from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Response, status

from app.core.deps import UsuarioAdmin
from app.modules.categorias.schemas import CategoriaCreate, CategoriaRead, CategoriaUpdate
from app.modules.categorias.service import (
    CategoriaError,
    CategoriaNoEncontrada,
    CategoriaService,
    NombreDuplicado,
)
from app.modules.categorias.unit_of_work import CategoriaUnitOfWork

router = APIRouter(prefix="/categorias", tags=["Categorías"])


def get_categoria_service() -> CategoriaService:
    return CategoriaService(CategoriaUnitOfWork())


ServiceDep = Annotated[CategoriaService, Depends(get_categoria_service)]


def _a_http(error: CategoriaError) -> HTTPException:
    if isinstance(error, CategoriaNoEncontrada):
        return HTTPException(status.HTTP_404_NOT_FOUND, detail="Categoría no encontrada")
    if isinstance(error, NombreDuplicado):
        return HTTPException(status.HTTP_409_CONFLICT, detail="Ya existe una categoría con ese nombre")
    return HTTPException(status.HTTP_400_BAD_REQUEST, detail=str(error))


@router.get("", response_model=list[CategoriaRead])
def listar_categorias(service: ServiceDep) -> list[CategoriaRead]:
    return service.listar()


@router.get("/{categoria_id}", response_model=CategoriaRead)
def obtener_categoria(categoria_id: int, service: ServiceDep) -> CategoriaRead:
    try:
        return service.obtener(categoria_id)
    except CategoriaError as e:
        raise _a_http(e)


@router.post("", response_model=CategoriaRead, status_code=status.HTTP_201_CREATED)
def crear_categoria(data: CategoriaCreate, _: UsuarioAdmin, service: ServiceDep) -> CategoriaRead:
    try:
        return service.crear(data)
    except CategoriaError as e:
        raise _a_http(e)


@router.put("/{categoria_id}", response_model=CategoriaRead)
def actualizar_categoria(
    categoria_id: int, data: CategoriaUpdate, _: UsuarioAdmin, service: ServiceDep
) -> CategoriaRead:
    try:
        return service.actualizar(categoria_id, data)
    except CategoriaError as e:
        raise _a_http(e)


@router.delete("/{categoria_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_categoria(categoria_id: int, _: UsuarioAdmin, service: ServiceDep) -> Response:
    try:
        service.eliminar(categoria_id)
    except CategoriaError as e:
        raise _a_http(e)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
