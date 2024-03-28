import mongoose from 'mongoose';
import { handleMongooseError } from '../helpers/handleMongooseError.js';
import { setUpdateSettings } from '../helpers/setUpdateSettings.js';

const contactSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Set name for contact'],
  },
  phone: {
    type: String,
    required: [true, 'Set phone for contact'],
    unique: true,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }
}, { versionKey: false, timestamps: true });

contactSchema.post('save', handleMongooseError);

contactSchema.pre('findOneAndUpdate', setUpdateSettings);

contactSchema.post('findOneAndUpdate', handleMongooseError);

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;