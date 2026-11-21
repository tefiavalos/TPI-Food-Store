from typing import Annotated

from pydantic import StringConstraints
from sqlmodel import Field, SQLModel

Nombre = Annotated[str, StringConstraints(strip_whitespace=True, min_length=2, max_length=100)]


class CategoriaCreate(SQLModel):
    nombre: Nombre
    descripcion: str | None = Field(default=None, max_length=500)


class CategoriaUpdate(SQLModel):
    nombre: Nombre | None = None
    descripcion: str | None = Field(default=None, max_length=500)


class CategoriaRead(SQLModel):
    id: int
    nombre: str
    descripcion: str | None
    activo: bool
