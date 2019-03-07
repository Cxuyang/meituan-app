import mongoose from 'mongoose'
// 在 Mongoose 中，所有数据都由一个 Schema 开始创建。
// 每一个 schema 都映射到一个 Mongodb 的集合(collection)，并定义了该集合(collection)中的文档(document)的形式
const Schema = mongoose.Schema
const UserSchema = new Schema({
  username: {
    type: String,
    unique: true, // 唯一的
    require: true
  },
  password: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true
  }
})
export default mongoose.model('User', UserSchema)