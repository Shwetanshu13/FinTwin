export function notFoundHandler(req, res) {
    return res.status(404).json({ error: "NOT_FOUND" });
}
