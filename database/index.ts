/**
 * Central export point for all database models.
 * Import models from this file for consistency across the application.
 * 
 * Usage:
 *   import { Event, Booking } from '@/database'
 */

export { default as Event } from './event.model'
export { default as Booking } from './booking.model'

// Export TypeScript interfaces for use in API routes and components
export type { IEvent } from './event.model'
export type { IBooking } from './booking.model'
