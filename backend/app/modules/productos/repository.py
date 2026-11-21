from sqlmodel import Session, col, func, select

from app.core.base_repository import BaseRepository
from app.modules.productos.models import Producto


class ProductoRepository(BaseRepository[Producto]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, Producto)

    def search(
        self,
        skip: int,
        limit: int,
        search: str | None = None,
        categoria_id: int | None = None,
        disponible: bool | None = None,
    ) -> tuple[int, list[Producto]]:
        consulta = select(Producto).where(Producto.activo == True)  # noqa: E712
        if search:
            consulta = consulta.where(col(Producto.nombre).ilike(f"%{search.strip()}%"))
        if categoria_id is not None:
            consulta = consulta.where(Producto.categoria_id == categoria_id)
        if disponible is not None:
            consulta = consulta.where(Producto.disponible == disponible)

        total = self.session.exec(select(func.count()).select_from(consulta.subquery())).one()
        items = self.session.exec(consulta.order_by(Producto.id).offset(skip).limit(limit)).all()
        return total, list(items)
