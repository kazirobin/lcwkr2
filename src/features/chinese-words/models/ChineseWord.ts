import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IExample {
  chinese: string;
  pinyin: string;
  meaningEn: string;
  meaningBn: string;
  type?: string;
}

export interface IRelatedWord {
  word: string;
  pinyin: string;
  meaningEn: string;
  meaningBn: string;
  wordType?: string;
  hskLevel?: number;
  examples?: IExample[];
}

export interface IChineseWord extends Document {
  character: string;
  pinyin: string;
  meaningEn: string;
  meaningBn: string;
  descriptionEn?: string;
  descriptionBn?: string;
  hskLevel?: number;
  strokeCount?: number;
  relatedWords: IRelatedWord[];
  createdAt: Date;
  updatedAt: Date;
}

const ChineseWordSchema = new Schema<IChineseWord>(
  {
    character: { type: String, required: true, unique: true, trim: true },
    pinyin: { type: String, required: true, trim: true },
    meaningEn: { type: String, required: true, trim: true },
    meaningBn: { type: String, required: true, trim: true },
    descriptionEn: { type: String, default: '' },
    descriptionBn: { type: String, default: '' },
    hskLevel: { type: Number, default: 1 },
    strokeCount: { type: Number, default: 0 },
    relatedWords: [
      {
        word: { type: String, required: true },
        pinyin: { type: String, required: true },
        meaningEn: { type: String, required: true },
        meaningBn: { type: String, required: true },
        wordType: { type: String, default: '' },
        hskLevel: { type: Number, default: 1 },
        examples: [
          {
            chinese: { type: String, default: '' },
            pinyin: { type: String, default: '' },
            meaningEn: { type: String, default: '' },
            meaningBn: { type: String, default: '' },
            type: { type: String, default: '' },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

const ChineseWord: Model<IChineseWord> =
  mongoose.models.ChineseWord || mongoose.model<IChineseWord>('ChineseWord', ChineseWordSchema);

export { ChineseWord };
export default ChineseWord;