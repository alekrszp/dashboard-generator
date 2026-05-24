import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserRepository from '../repositories/UserRepository.js';

class AuthService {
  async register({ name, email, password }) {
    if (!name || !email || !password) {
      throw new Error('Preencha todos os campos obrigatórios.');
    }

    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      const err = new Error('E-mail já cadastrado.');
      err.status = 400;
      throw err;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await UserRepository.create({
      name,
      email,
      password: hashedPassword
    });

    const token = this.generateToken(newUser.id);

    return {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt
      },
      token
    };
  }

  async login({ email, password }) {
    if (!email || !password) {
      throw new Error('Preencha todos os campos obrigatórios.');
    }

    const user = await UserRepository.findByEmail(email);
    if (!user) {
      const err = new Error('E-mail ou senha inválidos.');
      err.status = 401;
      throw err;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const err = new Error('E-mail ou senha inválidos.');
      err.status = 401;
      throw err;
    }

    const token = this.generateToken(user.id);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      },
      token
    };
  }

  generateToken(userId) {
    const secret = process.env.JWT_SECRET || 'fallback_secret_key';
    return jwt.sign({ userId }, secret, { expiresIn: '7d' });
  }
}

export default new AuthService();
