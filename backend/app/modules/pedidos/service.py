from datetime import date, datetime, time

from app.modules.pedidos.models import DetallePedido, Pedido
from app.modules.pedidos.schemas import (
    PedidoCreate,
    PedidoRead,
    PedidosPaginados,
    ResumenPedidos,
)
from app.modules.pedidos.unit_of_work import PedidoUnitOfWork
from app.modules.usuarios.schemas import UserPublic

PENDIENTE = "PENDIENTE"
EN_PREPARACION = "EN_PREPARACION"
ENTREGADO = "ENTREGADO"
CANCELADO = "CANCELADO"

TRANSICIONES: dict[str, set[str]] = {
    PENDIENTE: {EN_PREPARACION, CANCELADO},
    EN_PREPARACION: {ENTREGADO, CANCELADO},
    ENTREGADO: set(),
    CANCELADO: set(),
}


class PedidoError(Exception):
    pass


class PedidoNoEncontrado(PedidoError):
    pass


class ProductoNoEncontrado(PedidoError):
    def __init__(self, producto_id: int) -> None:
        super().__init__(f"El producto {producto_id} no existe o no está activo")


class PedidoAjeno(PedidoError):
    pass


class ProductoRepetido(PedidoError):
    def __init__(self) -> None:
        super().__init__("Hay productos repetidos en el pedido")


class ProductoNoDisponible(PedidoError):
    def __init__(self, nombre: str) -> None:
        super().__init__(f"El producto «{nombre}» no está disponible")


class StockInsuficiente(PedidoError):
    def __init__(self, nombre: str, stock: int) -> None:
        super().__init__(f"Stock insuficiente para «{nombre}» (disponible: {stock})")


class TransicionInvalida(PedidoError):
    def __init__(self, actual: str, nuevo: str) -> None:
        super().__init__(f"No se puede pasar un pedido de {actual} a {nuevo}")


class PedidoNoCancelable(PedidoError):
    def __init__(self) -> None:
        super().__init__("Solo se pueden cancelar pedidos en estado PENDIENTE")


class PedidoService:
    def __init__(self, uow: PedidoUnitOfWork) -> None:
        self.uow = uow

    def crear(self, usuario: UserPublic, data: PedidoCreate) -> PedidoRead:
        with self.uow as uow:
            ids = [item.producto_id for item in data.items]
            if len(ids) != len(set(ids)):
                raise ProductoRepetido()

            pedido = uow.pedidos.add(
                Pedido(
                    usuario_id=usuario.id,
                    estado=PENDIENTE,
                    forma_pago=data.forma_pago,
                    direccion_entrega=data.direccion_entrega,
                    notas=data.notas,
                    total=0,
                )
            )

            total = 0.0
            for item in data.items:
                producto = uow.productos.get_by_id(item.producto_id)
                if producto is None or not producto.activo:
                    raise ProductoNoEncontrado(item.producto_id)
                if not producto.disponible:
                    raise ProductoNoDisponible(producto.nombre)
                if producto.stock < item.cantidad:
                    raise StockInsuficiente(producto.nombre, producto.stock)

                producto.stock -= item.cantidad
                subtotal = round(producto.precio_base * item.cantidad, 2)
                pedido.items.append(
                    DetallePedido(
                        producto_id=item.producto_id,
                        cantidad=item.cantidad,
                        nombre_producto=producto.nombre,
                        precio_unitario=producto.precio_base,
                        subtotal=subtotal,
                    )
                )
                total += subtotal

            pedido.total = round(total, 2)
            uow.pedidos.add(pedido)
            return PedidoRead.model_validate(pedido)

    def listar(self, usuario: UserPublic, skip: int, limit: int, estado: str | None) -> PedidosPaginados:
        with self.uow as uow:
            if usuario.role == "admin":
                total, pedidos = uow.pedidos.list_paginado(skip, limit, estado)
            else:
                total, pedidos = uow.pedidos.list_by_usuario(usuario.id, skip, limit, estado)
            return PedidosPaginados(total=total, items=[PedidoRead.model_validate(p) for p in pedidos])

    def obtener(self, pedido_id: int, usuario: UserPublic) -> PedidoRead:
        with self.uow as uow:
            pedido = self._obtener(uow, pedido_id)
            if usuario.role != "admin" and pedido.usuario_id != usuario.id:
                raise PedidoAjeno()
            return PedidoRead.model_validate(pedido)

    def resumen(self) -> ResumenPedidos:
        with self.uow as uow:
            conteos = uow.pedidos.count_by_estado()
            inicio_de_hoy = datetime.combine(date.today(), time.min)
            return ResumenPedidos(
                pendientes=conteos.get(PENDIENTE, 0),
                en_preparacion=conteos.get(EN_PREPARACION, 0),
                entregados=conteos.get(ENTREGADO, 0),
                cancelados=conteos.get(CANCELADO, 0),
                pedidos_hoy=uow.pedidos.count_desde(inicio_de_hoy),
                ingresos_entregados=round(uow.pedidos.sum_total_por_estado(ENTREGADO), 2),
            )

    def cambiar_estado(self, pedido_id: int, nuevo_estado: str) -> PedidoRead:
        with self.uow as uow:
            pedido = self._obtener(uow, pedido_id)
            self._transicionar(uow, pedido, nuevo_estado)
            return PedidoRead.model_validate(pedido)

    def cancelar(self, pedido_id: int, usuario: UserPublic) -> PedidoRead:
        with self.uow as uow:
            pedido = self._obtener(uow, pedido_id)
            if pedido.usuario_id != usuario.id:
                raise PedidoAjeno()
            if pedido.estado != PENDIENTE:
                raise PedidoNoCancelable()
            self._transicionar(uow, pedido, CANCELADO)
            return PedidoRead.model_validate(pedido)

    @staticmethod
    def _obtener(uow: PedidoUnitOfWork, pedido_id: int) -> Pedido:
        pedido = uow.pedidos.get_by_id(pedido_id)
        if pedido is None:
            raise PedidoNoEncontrado()
        return pedido

    @staticmethod
    def _transicionar(uow: PedidoUnitOfWork, pedido: Pedido, nuevo_estado: str) -> None:
        if nuevo_estado not in TRANSICIONES.get(pedido.estado, set()):
            raise TransicionInvalida(pedido.estado, nuevo_estado)
        if nuevo_estado == CANCELADO:
            for linea in pedido.items:
                producto = uow.productos.get_by_id(linea.producto_id)
                if producto is not None:
                    producto.stock += linea.cantidad
        pedido.estado = nuevo_estado
        pedido.updated_at = datetime.now()
        uow.pedidos.add(pedido)
