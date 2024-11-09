import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "json-web-token";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String, //cloudnery url
      required: false,
    },
    password: {
      type: String,
      required: [true, "Password is Required"],
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  //pre-save middleware function to hash the password before saving the user to the database
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

userSchema.methods.isPasswordCorrect = function (password) {
  //method to compare the password entered by the user with the hashed password stored in the database
  return bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessTockens = function () {
  //method to generate an access token for the user
  jwt.sign(
    //jwt.sign() method is used to generate a JWT token with the user's information
    {
      _id: this._id, //payload of the token
      email: this.email,
      username: this.username,
      fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOCKEN_EXPIRY,
    }
  );
};
userSchema.methods.generateRefreshTockens = function () {
  //method to generate a refresh token for the user
  jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOCKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
