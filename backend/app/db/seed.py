from sqlmodel import Session, select

from app.core.database import create_all_tables, session_factory
from app.core.security import hash_password
from app.db.models import Categoria, Producto, Usuario

ADMIN = {
    "username": "admin",
    "full_name": "Administrador",
    "email": "admin@foodstore.com",
    "password": "Admin1234!",
}

CATEGORIAS = [
    ("Pizzas", "Pizzas artesanales a la piedra"),
    ("Hamburguesas", "Hamburguesas caseras con papas"),
    ("Bebidas", "Gaseosas, aguas y jugos"),
    ("Postres", "Dulces para terminar la comida"),
]

PRODUCTOS = [
    ("Pizzas", "Pizza muzzarella", "Salsa de tomate, muzzarella y aceitunas", 9500, 20,
     "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600"),
    ("Pizzas", "Pizza napolitana", "Muzzarella, tomate en rodajas, ajo y albahaca", 10800, 15,
     "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600"),
    ("Hamburguesas", "Hamburguesa clásica", "Carne, lechuga, tomate y queso cheddar", 8900, 25,
     "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600"),
    ("Hamburguesas", "Hamburguesa doble bacon", "Doble carne, doble cheddar y panceta", 11500, 12,
     "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600"),
    ("Bebidas", "Gaseosa cola 500 ml", "Bebida gaseosa sabor cola", 2200, 50,
     "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=600"),
    ("Bebidas", "Jugo de naranja exprimido", "Jugo natural de 400 ml", 3000, 30,
     "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600"),
    ("Postres", "Helado de dulce de leche", "Pote de 1/4 kg", 4500, 18,
     "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600"),
    ("Postres", "Brownie con nueces", "Porción de brownie casero", 3800, 22,
     "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600"),
]


def seed() -> None:
    create_all_tables()
    with session_factory() as session:
        _crear_admin(session)
        categorias = _crear_categorias(session)
        _crear_productos(session, categorias)
        session.commit()
    print("Seed completado: admin, categorías y productos cargados.")


def _crear_admin(session: Session) -> None:
    if session.exec(select(Usuario).where(Usuario.username == ADMIN["username"])).first():
        return
    session.add(
        Usuario(
            username=ADMIN["username"],
            full_name=ADMIN["full_name"],
            email=ADMIN["email"],
            hashed_password=hash_password(ADMIN["password"]),
            role="admin",
        )
    )


def _crear_categorias(session: Session) -> dict[str, Categoria]:
    resultado: dict[str, Categoria] = {}
    for nombre, descripcion in CATEGORIAS:
        categoria = session.exec(select(Categoria).where(Categoria.nombre == nombre)).first()
        if categoria is None:
            categoria = Categoria(nombre=nombre, descripcion=descripcion)
            session.add(categoria)
            session.flush()
        resultado[nombre] = categoria
    return resultado


def _crear_productos(session: Session, categorias: dict[str, Categoria]) -> None:
    for categoria, nombre, descripcion, precio, stock, imagen in PRODUCTOS:
        if session.exec(select(Producto).where(Producto.nombre == nombre)).first():
            continue
        session.add(
            Producto(
                categoria_id=categorias[categoria].id,
                nombre=nombre,
                descripcion=descripcion,
                precio_base=precio,
                stock=stock,
                imagen_url=imagen,
            )
        )


if __name__ == "__main__":
    seed()
