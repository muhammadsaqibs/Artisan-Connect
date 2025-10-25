import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// User Schema (same as in User.js)
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    avatarUrl: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", userSchema);

const setupAdmin = async () => {
  try {
    await connectDB();

    // Support CLI args: --email and --password and --name
    const argv = process.argv.slice(2);
    const getArg = (flag) => {
      const idx = argv.findIndex((a) => a === flag || a.startsWith(`${flag}=`));
      if (idx === -1) return undefined;
      const val = argv[idx].includes("=") ? argv[idx].split("=")[1] : argv[idx + 1];
      return val;
    };

    const argEmail = getArg("--email");
    const argPassword = getArg("--password");
    const argName = getArg("--name");

    const adminEmail = argEmail || process.env.ADMIN_EMAIL || "admin@zepvistore.com";
    const adminPassword = argPassword || process.env.ADMIN_PASSWORD || "AdminPass123!";
    const adminName = argName || process.env.ADMIN_NAME || "Admin User";

    console.log("Setting up admin user...");
    console.log(`Email: ${adminEmail}`);
    console.log(`Name: ${adminName}`);

    // Check if admin user already exists
    let adminUser = await User.findOne({ email: adminEmail.toLowerCase() });

    if (adminUser) {
      console.log("Admin user already exists. Updating...");
      adminUser.name = adminName;
      adminUser.isAdmin = true;
      adminUser.password = adminPassword; // Will be hashed by pre-save hook
      await adminUser.save();
      console.log("✅ Admin user updated successfully!");
    } else {
      console.log("Creating new admin user...");
      adminUser = new User({
        name: adminName,
        email: adminEmail.toLowerCase(),
        password: adminPassword, // Will be hashed by pre-save hook
        isAdmin: true,
      });
      await adminUser.save();
      console.log("✅ Admin user created successfully!");
    }

    console.log("\n📋 Admin User Details:");
    console.log(`Name: ${adminUser.name}`);
    console.log(`Email: ${adminUser.email}`);
    console.log(`Admin: ${adminUser.isAdmin}`);
    console.log(`ID: ${adminUser._id}`);

    console.log("\n🔑 Login Credentials:");
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);

    console.log("\n💡 To use this admin account:");
    console.log("1. Go to your website and click 'Sign Up'");
    console.log("2. Use the email and password above");
    console.log("3. You will be automatically redirected to the admin panel");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error setting up admin:", error);
    process.exit(1);
  }
};

setupAdmin();
