
export class AuthService {
  constructor(userRepo) {
    this.userRepo = userRepo;
  }

  async login(email, password) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new Error("USER_NOT_FOUND");

    const valid = await this.userRepo.comparePassword(password, user.password);
    if (!valid) throw new Error("INVALID_PASSWORD");

    const accessToken = await this.userRepo.createAccessToken(user.id);
    const refreshToken = await this.userRepo.createRefeshToken(user.id);

    const token = {
      accessToken,
      refreshToken,
    };
    return { token, userId: user.id };
  }

  async register(data) {
    const exists = await this.userRepo.findByEmail(data.email);
    if (exists) throw new Error("EMAIL_EXISTS");

    const hashed = await this.userRepo.hashedPassword(data.password);
    return this.userRepo.create({ ...data, password: hashed });
  }
}
