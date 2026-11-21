from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status

from app.core.deps import UsuarioAdmin
from app.modules.productos.schemas import (
    ProductoCreate,
    ProductoRead,
    ProductosPaginados,
    ProductoStockUpdate,
    ProductoUpdate,
)
from app.modules.productos.service import (
    CategoriaNoEncontrada,
    ProductoError,
    ProductoNoEncontrado,
    ProductoService,
)
from app.modules.productos.unit_of_work import ProductoUnitOfWork

router = APIRouter(prefix="/productos", tags=["Productos"])


def get_producto_service() -> ProductoService:
    return ProductoService(ProductoUnitOfWork())


ServiceDep = Annotated[ProductoService, Depends(get_producto_service)]


def _a_http(error: ProductoError) -> HTTPException:
    if isinstance(error, ProductoNoEncontrado):
        return HTTPException(status.HTTP_404_NOT_FOUND, detail="Producto no encontrado")
    if isinstance(error, CategoriaNoEncontrada):
        return HTTPException(status.HTTP_404_NOT_FOUND, detail="La categoría no existe o está dada de baja")
    return HTTPException(status.HTTP_400_BAD_REQUEST, detail=str(error))


@router.get("", response_model=ProductosPaginados)
def listar_productos(
    service: ServiceDep,
    skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
    search: Annotated[str | None, Query(max_length=100)] = None,
    categoria_id: int | None = None,
    disponible: bool | None = None,
) -> ProductosPaginados:
    return service.listar(skip, limit, search, categoria_id, disponible)


@router.get("/{producto_id}", response_model=ProductoRead)
def obtener_producto(producto_id: int, service: ServiceDep) -> ProductoRead:
    try:
        return service.obtener(producto_id)
    except ProductoError as e:
        raise _a_http(e)


@router.post("", response_model=ProductoRead, status_code=status.HTTP_201_CREATED)
def crear_producto(data: ProductoCreate, _: UsuarioAdmin, service: ServiceDep) -> ProductoRead:
    try:
        return service.crear(data)
    except ProductoError as e:
        raise _a_http(e)


@router.put("/{producto_id}", response_model=ProductoRead)
def actualizar_producto(
    producto_id: int, data: ProductoUpdate, _: UsuarioAdmin, service: ServiceDep
) -> ProductoRead:
    try:
        return service.actualizar(producto_id, data)
    except ProductoError as e:
        raise _a_http(e)


@router.patch("/{producto_id}/stock", response_model=ProductoRead)
def actualizar_stock(
    producto_id: int, data: ProductoStockUpdate, _: UsuarioAdmin, service: ServiceDep
) -> ProductoRead:
    try:
        return service.actualizar_stock(producto_id, data)
    except ProductoError as e:
        raise _a_http(e)


@router.delete("/{producto_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_producto(producto_id: int, _: UsuarioAdmin, service: ServiceDep) -> Response:
    try:
        service.eliminar(producto_id)
    except ProductoError as e:
        raise _a_http(e)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
