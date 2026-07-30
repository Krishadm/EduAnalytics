import mongoose from "mongoose";

const highlightSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    articleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },

    note: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);
const Highlight = mongoose.model("Highlight", highlightSchema);
export default Highlight;