import { eq } from 'drizzle-orm';
import { usersTable, db } from '../../db';
import { config } from '../../conf';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class UserRepository {
    async findByEmail(email) {
        const existingUsers = await db.select().from(usersTable).where(eq(usersTable.email, email));
        return existingUsers[0] || null;
    }
    async createUser(userData) {
        const [newUser] = await db.insert(userData).into(usersTable).returning('*');
        return newUser;
    }
    async findById(id) {
        const user = await db.select().from(usersTable).where(eq(usersTable.id, id));
        return user[0] || null;
    }
    async comparePassword(plainPassword, hashedPassword) {
        return bcrypt.compare(plainPassword, hashedPassword);
    }
    async hashedPassword(password) {
        return bcrypt.hash(password, 20);
    }
    async createRefeshToken(userId, refreshToken) {
        const refreshToken = jwt.sign(
            { id: userId },
            config.refreshTokenSecret,
            { expiresIn: config.refreshTokenExpiry }
        );
        return refreshToken;
    }
    async createAccessToken(userId) {
        const accessToken = jwt.sign(
            { id: userId },
            config.jwtSecret,
            { expiresIn: config.accessTokenExpiry }
        );
        return accessToken;
    }

};