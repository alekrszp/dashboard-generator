import User from '../models/User.js';

class UserRepository {
  async findByEmail(email) {
    const user = await User.findOne({ email });
    return user ? user.toObject() : null;
  }

  async findById(id) {
    const user = await User.findById(id);
    return user ? user.toObject() : null;
  }

  async create(userData) {
    const user = new User(userData);
    const savedUser = await user.save();
    return savedUser.toObject();
  }
}

export default new UserRepository();
