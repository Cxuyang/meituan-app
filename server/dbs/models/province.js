import mongoose from 'mongoose'
const Schema = mongoose.Schema
const ProvinceSchema = new Schema({
  id: {
    type: String,
    unique: true, // 唯一的
    require: true
  },
  value: {
    type: String,
    require: true
  }
})
export default mongoose.model('Province', ProvinceSchema)