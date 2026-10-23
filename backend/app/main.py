"""
Main FastAPI application entry point for Digital Life Navigator.
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging

from app.config import settings
from app.database import init_db
from app.routes.health import router as health_router
from app.routes.tasks import router as tasks_router
from app.routes.message import router as message_router
from app.routes.assistant import router as assistant_router
from app.routes.mcp import router as mcp_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("digital_life_navigator")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing database tables...")
    init_db()
    logger.info("Database initialized successfully.")
    yield


app = FastAPI(
    title=settings.APP_NAME,
    description="Show me what you're trying to do. I'll help you do it. Step-by-step guidance for less-confident digital users.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS configuration - use configured origin allowlist
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled server error on {request.url.path}: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "detail": "We encountered an unexpected issue, but your task data is safe. Please try again."
        }
    )


# Include Routers
app.include_router(health_router)
app.include_router(tasks_router)
app.include_router(message_router)
app.include_router(assistant_router)
app.include_router(mcp_router)


@app.get("/")
def root():
    return {
        "app": settings.APP_NAME,
        "tagline": "Show me what you're trying to do. I'll help you do it.",
        "status": "online",
        "documentation": "/docs",
        "health": "/health"
    }
