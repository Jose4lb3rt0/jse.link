import { Document, model, Schema } from "mongoose";
import { nanoid } from "nanoid";

export interface IURL extends Document {
    shortId: string
    originalUrl: string
    clicks: number
    createdAt: Date
}

const urlSchema = new Schema<IURL>(
    {
        shortId: {
            type: String,
            required: true,
            unique: true,
            default: () => nanoid(6)
        },
        originalUrl: {
            type: String,
            required: true,
            trim: true,
            validate: {
                validator: (value: string) => {
                    try {
                        new URL(value)
                        return true
                    } catch (error) {
                        return false
                    }
                },

                message: "La URL proporcionada no es válida."
            }
        },
        clicks: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: true
        }
    }
)

export default model<IURL>("URL", urlSchema)