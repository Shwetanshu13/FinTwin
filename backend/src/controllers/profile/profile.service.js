export class ProfileService {
    constructor(userRepo) {
        this.userRepo = userRepo;
    }

    _stripSensitiveFields(user) {
        if (!user) return null;
        const safeUser = { ...user };
        delete safeUser.passwordHash;
        return safeUser;
    }

    async getProfile(userId) {
        const user = await this.userRepo.findById(userId);
        if (!user) throw new Error("USER_NOT_FOUND");
        return this._stripSensitiveFields(user);
    }

    async updateProfile(userId, updates) {
        const numericUserId = Number(userId);
        const existing = await this.userRepo.findById(numericUserId);
        if (!existing) throw new Error("USER_NOT_FOUND");

        const next = {};
        if (updates?.username !== undefined) next.username = String(updates.username).trim();
        if (updates?.email !== undefined) next.email = String(updates.email).trim();
        if (updates?.fullName !== undefined) next.fullName = String(updates.fullName).trim();
        if (updates?.phone !== undefined) {
            const rawPhone = String(updates.phone ?? "").trim();
            next.phone = rawPhone ? rawPhone : null;
        }

        const providedKeys = Object.keys(next);
        if (providedKeys.length === 0) throw new Error("MISSING_FIELDS");

        if (next.username !== undefined) {
            if (!next.username) throw new Error("MISSING_FIELDS");
            const byUsername = await this.userRepo.findUserByUsername(next.username);
            if (byUsername && Number(byUsername.id) !== numericUserId) throw new Error("USERNAME_EXISTS");
        }

        if (next.email !== undefined) {
            if (!next.email) throw new Error("MISSING_FIELDS");
            const byEmail = await this.userRepo.findUserByEmail(next.email);
            if (byEmail && Number(byEmail.id) !== numericUserId) throw new Error("EMAIL_EXISTS");
        }

        if (next.fullName !== undefined && !next.fullName) {
            throw new Error("MISSING_FIELDS");
        }

        const updated = await this.userRepo.updateById(numericUserId, next);
        if (!updated) throw new Error("USER_NOT_FOUND");
        return this._stripSensitiveFields(updated);
    }
}
