from __future__ import annotations

import hashlib
import json
import re
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from app.models.schemas import RoleType


class AuthRepository:
    def __init__(self) -> None:
        backend_root = Path(__file__).resolve().parents[2]
        self._db_path = backend_root / "data" / "auth-db.json"
        self._ensure_db()
        self._ensure_seed_users()

    EMAIL_PATTERN = re.compile(r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$")

    def _ensure_db(self) -> None:
        self._db_path.parent.mkdir(parents=True, exist_ok=True)
        if not self._db_path.exists():
            self._write({"users": [], "tenants": []})

    def _read(self) -> dict[str, Any]:
        self._ensure_db()
        try:
            data = json.loads(self._db_path.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError):
            data = {"users": [], "tenants": []}
        data.setdefault("users", [])
        data.setdefault("tenants", [])

        cleaned_users = [item for item in data["users"] if isinstance(item, dict)]
        cleaned_tenants = [item for item in data["tenants"] if isinstance(item, dict)]
        data.setdefault("communityPosts", [])
        cleaned_posts = [item for item in data["communityPosts"] if isinstance(item, dict)]
        if len(cleaned_users) != len(data["users"]) or len(cleaned_tenants) != len(data["tenants"]):
            data["users"] = cleaned_users
            data["tenants"] = cleaned_tenants
            data["communityPosts"] = cleaned_posts
            self._write(data)
        else:
            data["users"] = cleaned_users
            data["tenants"] = cleaned_tenants
            data["communityPosts"] = cleaned_posts
        return data

    def _write(self, data: dict[str, Any]) -> None:
        self._db_path.write_text(json.dumps(data, indent=2), encoding="utf-8")

    @staticmethod
    def _hash_password(password: str) -> str:
        return hashlib.sha256(password.encode("utf-8")).hexdigest()

    @staticmethod
    def _slugify(school_name: str) -> str:
        slug = re.sub(r"[^a-z0-9]+", "-", school_name.strip().lower()).strip("-")
        return slug[:40] or "school"

    @staticmethod
    def _school_code(school_name: str) -> str:
        letters = re.sub(r"[^A-Z]", "", school_name.upper())
        return (letters[:3] or "NXL").ljust(3, "X")

    def _is_valid_email(self, email: str) -> bool:
        return bool(self.EMAIL_PATTERN.fullmatch(email.strip()))

    def _ensure_seed_users(self) -> None:
        data = self._read()
        slug = "meezankids"
        tenant = next((t for t in data["tenants"] if t.get("slug") == slug), None)
        if tenant is None:
            tenant = {
                "id": f"tenant-{slug}",
                "slug": slug,
                "schoolName": "Meezan Kids School",
                "code": "MKS",
                "createdAt": datetime.now(timezone.utc).isoformat(),
            }
            data["tenants"].append(tenant)

        seed_users = [
            ("management@meezankids.com", "Meezan Admin", "SCHOOL_ADMIN"),
            ("teacher@meezankids.com", "Meezan Teacher", "TEACHER"),
            ("student@meezankids.com", "Meezan Student", "STUDENT"),
        ]
        changed = False
        for email, name, role in seed_users:
            exists = next((u for u in data["users"] if u.get("email") == email and u.get("role") == role), None)
            if exists:
                continue
            now = datetime.now(timezone.utc).isoformat()
            data["users"].append(
                {
                    "id": f"user-{uuid.uuid4().hex}",
                    "tenantId": tenant["id"],
                    "name": name,
                    "email": email,
                    "mobile": "9999999999",
                    "role": role,
                    "authProvider": "password",
                    "passwordHash": self._hash_password("Meezan@123"),
                    "createdAt": now,
                    "updatedAt": now,
                }
            )
            changed = True
        if changed:
            self._write(data)

    def list_auth_tenants(self) -> list[dict[str, Any]]:
        return self._read()["tenants"]

    def create_user(
        self,
        *,
        name: str,
        school: str,
        email: str,
        mobile: str,
        password: str,
        role: RoleType,
    ) -> dict[str, Any]:
        data = self._read()
        normalized_email = email.strip().lower()
        if not self._is_valid_email(normalized_email):
            raise ValueError("Please enter a valid email address.")

        if any(user.get("email") == normalized_email for user in data["users"]):
            raise ValueError("This email is already registered. Please sign in.")

        slug = self._slugify(school)
        tenant = next((t for t in data["tenants"] if t.get("slug") == slug), None)
        if tenant is None:
            tenant = {
                "id": f"tenant-{slug}-{uuid.uuid4().hex[:8]}",
                "slug": slug,
                "schoolName": school,
                "code": self._school_code(school),
                "createdAt": datetime.now(timezone.utc).isoformat(),
            }
            data["tenants"].append(tenant)

        now = datetime.now(timezone.utc).isoformat()
        user = {
            "id": f"user-{uuid.uuid4().hex}",
            "tenantId": tenant["id"],
            "name": name.strip(),
            "email": normalized_email,
            "mobile": mobile.strip(),
            "role": role,
            "authProvider": "password",
            "passwordHash": self._hash_password(password),
            "createdAt": now,
            "updatedAt": now,
        }
        data["users"].append(user)
        self._write(data)
        return {"user": user, "tenant": tenant}

    def authenticate_user(
        self,
        *,
        workspace: str,
        email: str,
        password: str,
        role: RoleType,
    ) -> dict[str, Any] | None:
        data = self._read()
        normalized_email = email.strip().lower()
        if not self._is_valid_email(normalized_email):
            return None
        workspace_slug = workspace.strip().lower()

        user = next((item for item in data["users"] if item.get("email") == normalized_email), None)
        if user is None:
            return None
        if user.get("passwordHash") != self._hash_password(password):
            return None

        tenant = next((item for item in data["tenants"] if item.get("id") == user.get("tenantId")), None)
        if tenant is None:
            return None
        if workspace_slug and tenant.get("slug") != workspace_slug:
            return None
        if role and user.get("role") != role:
            return None

        if user.get("passwordHash") is None:
            return None

        return {"user": user, "tenant": tenant}

    def create_or_get_social_user(
        self,
        *,
        provider: str,
        name: str,
        school: str,
        email: str,
        role: RoleType,
    ) -> dict[str, Any]:
        data = self._read()
        normalized_email = email.strip().lower()
        if not self._is_valid_email(normalized_email):
            raise ValueError("Please enter a valid email address.")

        existing = next((u for u in data["users"] if u.get("email") == normalized_email), None)
        if existing is not None:
            tenant = next((t for t in data["tenants"] if t.get("id") == existing.get("tenantId")), None)
            if tenant is None:
                raise ValueError("Associated school workspace was not found.")
            return {"user": existing, "tenant": tenant}

        slug = self._slugify(school)
        tenant = next((t for t in data["tenants"] if t.get("slug") == slug), None)
        if tenant is None:
            tenant = {
                "id": f"tenant-{slug}-{uuid.uuid4().hex[:8]}",
                "slug": slug,
                "schoolName": school,
                "code": self._school_code(school),
                "createdAt": datetime.now(timezone.utc).isoformat(),
            }
            data["tenants"].append(tenant)

        now = datetime.now(timezone.utc).isoformat()
        user = {
            "id": f"user-{uuid.uuid4().hex}",
            "tenantId": tenant["id"],
            "name": name.strip(),
            "email": normalized_email,
            "mobile": "",
            "role": role,
            "authProvider": provider,
            "passwordHash": None,
            "createdAt": now,
            "updatedAt": now,
        }
        data["users"].append(user)
        self._write(data)
        return {"user": user, "tenant": tenant}

    def reset_password(self, *, email: str, new_password: str) -> None:
        data = self._read()
        normalized_email = email.strip().lower()
        user = next((item for item in data["users"] if item.get("email") == normalized_email), None)
        if user is None:
            raise ValueError("No account found with this email.")

        user["passwordHash"] = self._hash_password(new_password)
        user["updatedAt"] = datetime.now(timezone.utc).isoformat()
        self._write(data)

    def _tenant_by_workspace(self, data: dict[str, Any], workspace: str) -> dict[str, Any]:
        slug = workspace.strip().lower()
        tenant = next((item for item in data["tenants"] if str(item.get("slug", "")).lower() == slug), None)
        if tenant is None:
            raise ValueError("Unknown workspace.")
        return tenant

    @staticmethod
    def _can_view(role: RoleType, audience: str) -> bool:
        if audience == "ALL":
            return True
        if audience == "TEACHERS":
            return role in ("TEACHER", "SCHOOL_ADMIN")
        if audience == "STUDENTS":
            return role in ("STUDENT", "SCHOOL_ADMIN")
        return False

    def list_community_posts(self, *, workspace: str, role: RoleType) -> list[dict[str, Any]]:
        data = self._read()
        tenant = self._tenant_by_workspace(data, workspace)
        posts = [
            post
            for post in data["communityPosts"]
            if post.get("tenantId") == tenant.get("id") and self._can_view(role, str(post.get("audience", "ALL")))
        ]
        posts.sort(key=lambda post: str(post.get("createdAt", "")), reverse=True)
        return posts

    def create_community_post(
        self,
        *,
        workspace: str,
        author_role: RoleType,
        author_name: str,
        audience: str,
        category: str,
        message: str,
        attachments: list[dict[str, Any]],
    ) -> dict[str, Any]:
        data = self._read()
        tenant = self._tenant_by_workspace(data, workspace)
        content = message.strip()
        if not content:
            raise ValueError("Post message cannot be empty.")
        now = datetime.now(timezone.utc).isoformat()
        post = {
            "id": f"post-{uuid.uuid4().hex}",
            "tenantId": tenant["id"],
            "workspace": tenant["slug"],
            "authorRole": author_role,
            "authorName": author_name.strip() or "School Admin",
            "audience": audience,
            "category": category.strip() or "General",
            "message": content,
            "createdAt": now,
            "attachments": attachments,
            "reactions": {"like": 0, "clap": 0, "heart": 0},
            "comments": [],
        }
        data["communityPosts"].append(post)
        self._write(data)
        return post

    def update_community_post(self, *, workspace: str, post_id: str, message: str) -> dict[str, Any]:
        data = self._read()
        tenant = self._tenant_by_workspace(data, workspace)
        post = next((p for p in data["communityPosts"] if p.get("id") == post_id and p.get("tenantId") == tenant.get("id")), None)
        if post is None:
            raise ValueError("Post not found.")
        content = message.strip()
        if not content:
            raise ValueError("Post message cannot be empty.")
        post["message"] = content
        post["updatedAt"] = datetime.now(timezone.utc).isoformat()
        self._write(data)
        return post

    def delete_community_post(self, *, workspace: str, post_id: str) -> None:
        data = self._read()
        tenant = self._tenant_by_workspace(data, workspace)
        before = len(data["communityPosts"])
        data["communityPosts"] = [
            post
            for post in data["communityPosts"]
            if not (post.get("id") == post_id and post.get("tenantId") == tenant.get("id"))
        ]
        if len(data["communityPosts"]) == before:
            raise ValueError("Post not found.")
        self._write(data)

    def add_community_comment(
        self,
        *,
        workspace: str,
        post_id: str,
        author_name: str,
        role: RoleType,
        text: str,
    ) -> dict[str, Any]:
        data = self._read()
        tenant = self._tenant_by_workspace(data, workspace)
        post = next((p for p in data["communityPosts"] if p.get("id") == post_id and p.get("tenantId") == tenant.get("id")), None)
        if post is None:
            raise ValueError("Post not found.")
        comment_text = text.strip()
        if not comment_text:
            raise ValueError("Comment cannot be empty.")
        comment = {
            "id": f"comment-{uuid.uuid4().hex}",
            "authorName": author_name.strip() or "User",
            "role": role,
            "text": comment_text,
            "createdAt": datetime.now(timezone.utc).isoformat(),
        }
        comments = post.setdefault("comments", [])
        comments.append(comment)
        self._write(data)
        return post

    def add_community_reaction(self, *, workspace: str, post_id: str, emoji: str) -> dict[str, Any]:
        data = self._read()
        tenant = self._tenant_by_workspace(data, workspace)
        post = next((p for p in data["communityPosts"] if p.get("id") == post_id and p.get("tenantId") == tenant.get("id")), None)
        if post is None:
            raise ValueError("Post not found.")
        reactions = post.setdefault("reactions", {"like": 0, "clap": 0, "heart": 0})
        reactions[emoji] = int(reactions.get(emoji, 0)) + 1
        self._write(data)
        return post
