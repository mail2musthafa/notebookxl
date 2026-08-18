from fastapi import APIRouter, HTTPException, Query, status

from app.models.schemas import (
    CommunityCommentCreateRequest,
    CommunityPost,
    CommunityPostCreateRequest,
    CommunityPostsResponse,
    CommunityPostUpdateRequest,
    CommunityReactionRequest,
    MessageResponse,
    RoleType,
)
from app.repositories.auth_repository import AuthRepository

router = APIRouter(prefix="/community", tags=["community"])
repository = AuthRepository()


def _to_post(payload: dict) -> CommunityPost:
    return CommunityPost(
        id=payload.get("id", ""),
        tenant_id=payload.get("tenantId", ""),
        workspace=payload.get("workspace", ""),
        author_role=payload.get("authorRole", "SCHOOL_ADMIN"),
        author_name=payload.get("authorName", "School Admin"),
        audience=payload.get("audience", "ALL"),
        category=payload.get("category", "General"),
        message=payload.get("message", ""),
        created_at=payload.get("createdAt", ""),
        attachments=[
            {
                "id": item.get("id", ""),
                "name": item.get("name", "attachment"),
                "type": item.get("type", ""),
                "kind": item.get("kind", "file"),
                "size": int(item.get("size", 0)),
                "src": item.get("src", ""),
            }
            for item in payload.get("attachments", [])
        ],
        reactions={
            "like": int(payload.get("reactions", {}).get("like", 0)),
            "clap": int(payload.get("reactions", {}).get("clap", 0)),
            "heart": int(payload.get("reactions", {}).get("heart", 0)),
        },
        comments=[
            {
                "id": comment.get("id", ""),
                "author_name": comment.get("authorName", "User"),
                "role": comment.get("role", "STUDENT"),
                "text": comment.get("text", ""),
                "created_at": comment.get("createdAt", ""),
            }
            for comment in payload.get("comments", [])
        ],
    )


@router.get("/posts", response_model=CommunityPostsResponse)
def list_posts(workspace: str = Query(...), role: RoleType = Query("STUDENT")) -> CommunityPostsResponse:
    try:
        posts = repository.list_community_posts(workspace=workspace, role=role)
        return CommunityPostsResponse(posts=[_to_post(post) for post in posts])
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc


@router.post("/posts", response_model=CommunityPost, status_code=status.HTTP_201_CREATED)
def create_post(payload: CommunityPostCreateRequest) -> CommunityPost:
    if payload.author_role != "SCHOOL_ADMIN":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only school admin can create posts.")
    try:
        post = repository.create_community_post(
            workspace=payload.workspace,
            author_role=payload.author_role,
            author_name=payload.author_name,
            audience=payload.audience,
            category=payload.category,
            message=payload.message,
            attachments=[item.model_dump() for item in payload.attachments],
        )
        return _to_post(post)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc


@router.put("/posts/{post_id}", response_model=CommunityPost)
def update_post(post_id: str, payload: CommunityPostUpdateRequest) -> CommunityPost:
    if payload.actor_role != "SCHOOL_ADMIN":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only school admin can edit posts.")
    try:
        post = repository.update_community_post(workspace=payload.workspace, post_id=post_id, message=payload.message)
        return _to_post(post)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc


@router.delete("/posts/{post_id}", response_model=MessageResponse)
def delete_post(post_id: str, workspace: str = Query(...), actor_role: RoleType = Query(...)) -> MessageResponse:
    if actor_role != "SCHOOL_ADMIN":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only school admin can delete posts.")
    try:
        repository.delete_community_post(workspace=workspace, post_id=post_id)
        return MessageResponse(message="Post deleted.")
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc


@router.post("/posts/{post_id}/comments", response_model=CommunityPost)
def add_comment(post_id: str, payload: CommunityCommentCreateRequest) -> CommunityPost:
    try:
        post = repository.add_community_comment(
            workspace=payload.workspace,
            post_id=post_id,
            author_name=payload.author_name,
            role=payload.role,
            text=payload.text,
        )
        return _to_post(post)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc


@router.post("/posts/{post_id}/reactions", response_model=CommunityPost)
def add_reaction(post_id: str, payload: CommunityReactionRequest) -> CommunityPost:
    try:
        post = repository.add_community_reaction(workspace=payload.workspace, post_id=post_id, emoji=payload.emoji)
        return _to_post(post)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
