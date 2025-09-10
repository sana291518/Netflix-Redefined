from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import your skill routers here
from skills import recommend, actor_info, co_actor, show_details

app = FastAPI()

origins = [
    "http://localhost:5173",  # Your frontend origin
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(recommend.router, prefix="/skills/recommend")
app.include_router(actor_info.router, prefix="/skills/actor_info")
app.include_router(co_actor.router, prefix="/skills/co_actor")
app.include_router(show_details.router, prefix="/skills/show_details")
