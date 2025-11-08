import mongoose, { Document, Model, Schema } from 'mongoose'

/**
 * TypeScript interface for Event document.
 * Extends Document to include Mongoose methods and properties.
 */
export interface IEvent extends Document {
  title: string
  slug: string
  description: string
  overview: string
  image: string
  venue: string
  location: string
  date: string
  time: string
  mode: string
  audience: string
  agenda: string[]
  organizer: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

/**
 * Event Schema definition with validation and automatic timestamps.
 */
const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
      trim: true,
    },
    overview: {
      type: String,
      required: [true, 'Event overview is required'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Event image is required'],
      trim: true,
    },
    venue: {
      type: String,
      required: [true, 'Event venue is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Event location is required'],
      trim: true,
    },
    date: {
      type: String,
      required: [true, 'Event date is required'],
    },
    time: {
      type: String,
      required: [true, 'Event time is required'],
    },
    mode: {
      type: String,
      required: [true, 'Event mode is required'],
      enum: ['online', 'offline', 'hybrid'],
      lowercase: true,
    },
    audience: {
      type: String,
      required: [true, 'Target audience is required'],
      trim: true,
    },
    agenda: {
      type: [String],
      required: [true, 'Event agenda is required'],
      validate: {
        validator: (arr: string[]) => arr.length > 0,
        message: 'Agenda must contain at least one item',
      },
    },
    organizer: {
      type: String,
      required: [true, 'Event organizer is required'],
      trim: true,
    },
    tags: {
      type: [String],
      required: [true, 'Event tags are required'],
      validate: {
        validator: (arr: string[]) => arr.length > 0,
        message: 'At least one tag is required',
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
)

/**
 * Pre-save hook to:
 * 1. Generate URL-friendly slug from title (only if title changed)
 * 2. Normalize date to ISO format
 * 3. Ensure time is in consistent format
 */
eventSchema.pre('save', function (next) {
  // Generate slug only if title is new or modified
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, '') // Trim hyphens from start/end
  }

  // Normalize date to ISO format if modified
  if (this.isModified('date')) {
    try {
      const parsedDate = new Date(this.date)
      if (isNaN(parsedDate.getTime())) {
        return next(new Error('Invalid date format'))
      }
      this.date = parsedDate.toISOString().split('T')[0] // Store as YYYY-MM-DD
    } catch (error) {
      return next(new Error('Invalid date format'))
    }
  }

  // Normalize time format (HH:MM AM/PM or HH:MM - HH:MM AM/PM)
  if (this.isModified('time')) {
    this.time = this.time.trim()
    if (!this.time) {
      return next(new Error('Time cannot be empty'))
    }
  }

  next()
})

// Create unique index on slug for fast lookups
eventSchema.index({ slug: 1 }, { unique: true })

// Additional indexes for common queries
eventSchema.index({ date: 1 })
eventSchema.index({ mode: 1 })
eventSchema.index({ tags: 1 })

/**
 * Export Event model.
 * Uses singleton pattern to prevent model recompilation during hot-reloading.
 */
const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>('Event', eventSchema)

export default Event
