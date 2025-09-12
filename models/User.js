import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // ⚠️ opcional si viene de Google
    direccion: {
      calle: { type: String },
      ciudad: { type: String },
      provincia: { type: String },
      codigoPostal: { type: String },
      pais: { type: String },
    },
    rol: { type: String, enum: ["user", "admin"], default: "user" },
    provider: { type: String, default: "credentials" }, // "credentials" o "google"
  },
  { timestamps: true }
);

// 🔒 encriptar password antes de guardar si existe
UserSchema.pre("save", async function (next) {
  if (this.password && this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
