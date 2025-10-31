import asyncio
import sys
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.db import engine
from app.models import Base


async def create_tables():
    """Create all database tables"""
    print("Creating database tables...")
    
    async with engine.begin() as conn:        
        await conn.run_sync(Base.metadata.create_all)
    
    print("✅ Database tables created successfully!")
    await engine.dispose()


async def drop_tables():
    """Drop all database tables"""
    print("Dropping database tables...")
    
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    
    print("✅ Database tables dropped successfully!")
    await engine.dispose()


if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == "drop":
        asyncio.run(drop_tables())
    else:
        asyncio.run(create_tables())