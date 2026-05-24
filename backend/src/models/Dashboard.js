import mongoose from 'mongoose';

const widgetSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ["bar", "line", "pie", "table", "area", "radar"],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  xKey: {
    type: String,
    required: true
  },
  yKey: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  }
}, { _id: false });

const dashboardSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => uuidv4()
  },
  name: {
    type: String,
    required: true
  },
  widgets: {
    type: [widgetSchema],
    default: []
  },
  datasetId: {
    type: String,
    ref: 'Dataset',
    required: true
  },
  userId: {
    type: String,
    ref: 'User',
    required: true
  }
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
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

const Dashboard = mongoose.model('Dashboard', dashboardSchema);
export default Dashboard;
