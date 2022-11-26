import mongoose from "mongoose";

/* TaskSchema will correspond to a collection in your MongoDB database. */
const TaskSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, "Please provide a user ID for this task."],
  },
  record: {
    type: Number,
    required: [true, "Unique ID required."],
  },
  task: {
    type: String,
    required: [true, "Please provide a title for this task."],
    maxlength: [40, "Task cannot be more than 40 characters"],
  },
  description: {
    type: String,
    required: [true, "Please provide the description"],
  },
  author: {
    type: String,
    required: [true, "Please provide the author name"],
    maxlength: [40, "Author cannot be more than 40 characters"],
  },
  status: {
    type: Number,
    default: 1,
  },
  file: {
    type: Buffer,
  },
  filename: {
    type: String,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

TaskSchema.pre("find", function () {
  this.where({ isDeleted: false });
  this.sort({ record:1 });
});

TaskSchema.pre("findOne", function () {
  this.where({ isDeleted: false });
  this.sort({ record:1 });
});

export default mongoose.models.Task || mongoose.model("Task", TaskSchema);
