import { Document, model, Schema } from "mongoose"
import { nanoid } from "nanoid"

export interface IURL extends Document {
    shortId: string
    originalUrl: string
    clicks: number
    expiresAt?: Date | null
    createdAt: Date
    updatedAt: Date
}

const urlSchema = new Schema<IURL>(
    {
        shortId: {
            type: String,
            required: true,
            unique: true,
            default: () => nanoid(6),
            index: true,
        },
        originalUrl: {
            type: String,
            required: true,
            trim: true,
            maxlength: 2048,
        },
        clicks: {
            type: Number,
            default: 0,
        },
        expiresAt: {
            type: Date,
            default: null,
            index: { expireAfterSeconds: 0 },
        },
    },
    {
        timestamps: true,
    }
)

export default model<IURL>("URL", urlSchema)
