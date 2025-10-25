import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "../src/models/Category.js";

dotenv.config();

const BASE = [
  { name: "Plumbing", subs: ["Pipe Repair", "Geyser Install", "Leak Fix"] },
  { name: "Electrical", subs: ["Wiring", "Appliance Repair", "Switch/Socket"] },
  { name: "Carpentry", subs: ["Furniture Repair", "Door/Lock", "Custom Work"] },
  { name: "Cleaning", subs: ["Home Cleaning", "Bathroom Cleaning", "Kitchen"] },
  { name: "Painting", subs: ["Interior", "Exterior", "Touch-up"] },
  { name: "Barber", subs: ["Haircut", "Beard", "Kids Cut"] },
  { name: "Cooking", subs: ["Home Cook", "Event Cook", "Meal Prep"] },
];

function idify(t) {
  return t.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
}

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    for (const c of BASE) {
      const id = idify(c.name);
      const doc = await Category.findOneAndUpdate(
        { id },
        {
          $set: {
            name: c.name,
            id,
            slug: id,
            subcategories: c.subs.map((s) => ({ id: idify(s), name: s })),
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      console.log("Upserted:", doc.name);
    }
    console.log("✅ Seeded categories");
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

run();


