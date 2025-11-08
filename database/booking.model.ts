import mongoose, { Document, Model, Schema } from 'mongoose'
import Event from './event.model'

/**
 * TypeScript interface for Booking document.
 * Extends Document to include Mongoose methods and properties.
 */
export interface IBooking extends Document {
  eventId: mongoose.Types.ObjectId
  email: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Booking Schema definition with validation and automatic timestamps.
 */
const bookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      validate: {
        validator: function (email: string): boolean {
          // RFC 5322 compliant email validation
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          return emailRegex.test(email)
        },
        message: 'Please provide a valid email address',
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
)

/**
 * Pre-save hook to validate that the referenced Event exists.
 * Prevents orphaned bookings by checking eventId before saving.
 */
bookingSchema.pre('save', async function (next) {
  // Only validate eventId if it's new or modified
  if (this.isModified('eventId')) {
    try {
      const eventExists = await Event.findById(this.eventId)
      
      if (!eventExists) {
        return next(
          new Error(
            `Event with ID ${this.eventId} does not exist. Cannot create booking.`
          )
        )
      }
    } catch (error) {
      return next(
        new Error(
          `Failed to validate event reference: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`
        )
      )
    }
  }

  next()
})

// Create index on eventId for faster queries (e.g., finding all bookings for an event)
bookingSchema.index({ eventId: 1 })

// Composite index for finding bookings by event and email (useful for duplicate prevention)
bookingSchema.index({ eventId: 1, email: 1 })

/**
 * Export Booking model.
 * Uses singleton pattern to prevent model recompilation during hot-reloading.
 */
const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>('Booking', bookingSchema)

export default Booking
