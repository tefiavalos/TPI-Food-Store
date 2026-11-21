from datetime import datetime

from sqlmodel import Session, col, func, select

from app.core.base_repository import BaseRepository
from app.modules.pedidos.models import Pedido


class PedidoRepository(BaseRepository[Pedido]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, Pedido)

    def list_paginado(
        self, skip: int, limit: int, estado: str | None = None, usuario_id: int | None = None
    ) -> tuple[int, list[Pedido]]:
        consulta = select(Pedido)
        if usuario_id is not None:
            consulta = consulta.where(Pedido.usuario_id == usuario_id)
        if estado is not None:
            consulta = consulta.where(Pedido.estado == estado)
        total = self.session.exec(select(func.count()).select_from(consulta.subquery())).one()
        orden = consulta.order_by(col(Pedido.created_at).desc(), col(Pedido.id).desc())
        items = self.session.exec(orden.offset(skip).limit(limit)).all()
        return total, list(items)

    def list_by_usuario(
        self, usuario_id: int, skip: int, limit: int, estado: str | None = None
    ) -> tuple[int, list[Pedido]]:
        return self.list_paginado(skip, limit, estado, usuario_id=usuario_id)

    def count_by_estado(self) -> dict[str, int]:
        consulta = select(Pedido.estado, func.count(col(Pedido.id))).group_by(Pedido.estado)
        return {estado: cantidad for estado, cantidad in self.session.exec(consulta).all()}

    def count_desde(self, desde: datetime) -> int:
        consulta = select(func.count(col(Pedido.id))).where(Pedido.created_at >= desde)
        return self.session.exec(consulta).one()

    def sum_total_por_estado(self, estado: str) -> float:
        consulta = select(func.coalesce(func.sum(Pedido.total), 0)).where(Pedido.estado == estado)
        return float(self.session.exec(consulta).one())
