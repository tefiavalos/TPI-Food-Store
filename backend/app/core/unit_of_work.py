from collections.abc import Callable
from types import TracebackType
from typing import Self

from sqlmodel import Session

from app.core.database import session_factory


class UnitOfWork:
    session: Session

    def __init__(self, factory: Callable[[], Session] = session_factory) -> None:
        self.session_factory = factory

    def __enter__(self) -> Self:
        self.session = self.session_factory()
        self._crear_repositorios()
        return self

    def _crear_repositorios(self) -> None:
        pass

    def __exit__(
        self,
        exc_type: type[BaseException] | None,
        exc_val: BaseException | None,
        exc_tb: TracebackType | None,
    ) -> None:
        try:
            if exc_type:
                self.session.rollback()
            else:
                self.session.commit()
        finally:
            self.session.close()
