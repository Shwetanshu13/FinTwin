import { requestJsonAuthed } from "./http";

export async function getProfile() {
    return requestJsonAuthed("/profile", { method: "GET" });
}

export async function updateProfile(patch) {
    return requestJsonAuthed("/profile", { method: "PATCH", body: patch });
}
