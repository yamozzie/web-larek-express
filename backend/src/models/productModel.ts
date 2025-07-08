import mongoose, { Schema } from 'mongoose';

export interface IProduct {
    title: string,
    image: { fileName: string, originalName: string; },
    category: string,
    description?: string,
    price?: number
}

const productSchema = new Schema<IProduct>({
  title: {
    type: String,
    minlength: [2, 'Минимальная длина поля 2 символа'],
    maxlength: [30, 'Максимальная длина поля 30 символа'],
    required: [true, 'Поле title должно быть обязательно заполнено'],
    unique: true,
  },
  image: {
    type: { fileName: String, originalName: String },
    required: [true, 'Поле image должно быть обязательно заполнено'],
  },
  category: {
    type: String,
    required: [true, 'Поле category должно быть обязательно заполнено'],
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    default: null,
  },
});

const product = mongoose.model<IProduct>('product', productSchema);

export default product;
