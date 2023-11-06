import mongoose from "mongoose";

const {Schema, model} = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isAccess: {
    type: Boolean,
    default: true,
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
})

export default model('User', userSchema)