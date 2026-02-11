import { requestJsonAuthed } from "./http";

export async function submitOnboarding(payload) {
    return requestJsonAuthed("/onboarding", {
        method: "POST",
        body: payload,
    });
}
