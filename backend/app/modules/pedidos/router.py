from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.core.deps import UsuarioActivo, UsuarioAdmin
from app.modules.pedidos.schemas import (
    CambioEstado,
    EstadoPedido,
    PedidoCreate,
    PedidoRead,
    PedidosPaginados,
    ResumenPedidos,
)
from app.modules.pedidos.service import (
    PedidoAjeno,
    PedidoError,
    PedidoNoEncontrado,
    PedidoService,
    ProductoNoEncontrado,
)
from app.modules.pedidos.unit_of_work import PedidoUnitOfWork

router = APIRouter(prefix="/pedidos", tags=["Pedidos"])


def get_pedido_service() -> PedidoService:
    return PedidoService(PedidoUnitOfWork())


ServiceDep = Annotated[PedidoService, Depends(get_pedido_service)]


def _a_http(error: PedidoError) -> HTTPException:
    if isinstance(error, PedidoNoEncontrado):
        return HTTPException(status.HTTP_404_NOT_FOUND, detail="Pedido no encontrado")
    if isinstance(error, ProductoNoEncontrado):
        return HTTPException(status.HTTP_404_NOT_FOUND, detail=str(error))
    if isinstance(error, PedidoAjeno):
        return HTTPException(status.HTTP_403_FORBIDDEN, detail="El pedido pertenece a otro usuario")
    return HTTPException(status.HTTP_400_BAD_REQUEST, detail=str(error))


@router.post("", response_model=PedidoRead, status_code=status.HTTP_201_CREATED)
def crear_pedido(data: PedidoCreate, usuario: UsuarioActivo, service: ServiceDep) -> PedidoRead:
    try:
        return service.crear(usuario, data)
    except PedidoError as e:
        raise _a_http(e)


@router.get("", response_model=PedidosPaginados)
def listar_pedidos(
    usuario: UsuarioActivo,
    service: ServiceDep,
    skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
    estado: EstadoPedido | None = None,
) -> PedidosPaginados:
    return service.listar(usuario, skip, limit, estado)


@router.get("/resumen", response_model=ResumenPedidos)
def resumen_pedidos(_: UsuarioAdmin, service: ServiceDep) -> ResumenPedidos:
    return service.resumen()


@router.get("/{pedido_id}", response_model=PedidoRead)
def obtener_pedido(pedido_id: int, usuario: UsuarioActivo, service: ServiceDep) -> PedidoRead:
    try:
        return service.obtener(pedido_id, usuario)
    except PedidoError as e:
        raise _a_http(e)


@router.patch("/{pedido_id}/estado", response_model=PedidoRead)
def cambiar_estado(
    pedido_id: int, data: CambioEstado, _: UsuarioAdmin, service: ServiceDep
) -> PedidoRead:
    try:
        return service.cambiar_estado(pedido_id, data.estado)
    except PedidoError as e:
        raise _a_http(e)


@router.patch("/{pedido_id}/cancelar", response_model=PedidoRead)
def cancelar_pedido(pedido_id: int, usuario: UsuarioActivo, service: ServiceDep) -> PedidoRead:
    try:
        return service.cancelar(pedido_id, usuario)
    except PedidoError as e:
        raise _a_http(e)
