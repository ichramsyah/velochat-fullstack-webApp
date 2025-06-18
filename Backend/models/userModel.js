// backend/models/userModel.js

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Nama tidak boleh kosong'],
    },
    email: {
      type: String,
      required: [true, 'Email tidak boleh kosong'],
      unique: true,
      match: [/.+\@.+\..+/, 'Masukkan format email yang valid'],
    },
    password: {
      type: String,
      required: [true, 'Password tidak boleh kosong'],
    },
    profilePic: {
      type: String,
      default: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
    },
    publicKey: {
      type: String,
    },
    contacts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

export default User;
