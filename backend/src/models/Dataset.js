import mongoose from 'mongoose';

const datasetSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => uuidv4()
  },
  name: {
    type: String,
    required: true
  },
  columns: {
    type: [String],
    required: true,
    default: []
  },
  rows: {
    type: [mongoose.Schema.Types.Mixed],
    required: true,
    default: []
  },
  userId: {
    type: String,
    ref: 'User',
    required: true
  }
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: false },
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  },
  toObject: {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  }
});

const Dataset = mongoose.model('Dataset', datasetSchema);
export default Dataset;
