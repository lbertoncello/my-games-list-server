import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    title: String,
    rating: Number,
    summary: String,
  },
  {
    timestamps: true,
    statics: {
      deleteById(id) {
        return this.deleteOne({ _id: id });
      },
    },
  }
);

export default schema;
