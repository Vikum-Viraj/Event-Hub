import EventCard from "@/components/EventCard";
import { ExploreBtn } from "@/components/ExploreBtn";

const events = [
  { title: "Hacktoberfest 2023", image: "/images/event-full.png", slug: "hacktoberfest-2023", location: "Online", date: "Oct 1 - Oct 31", time: "All Day" },
  { title: "JS Conference", image: "/images/event-full.png", slug: "js-conference", location: "San Francisco", date: "Nov 5", time: "10:00 AM - 5:00 PM" },
  { title: "React Summit", image: "/images/event-full.png", slug: "react-summit", location: "New York", date: "Dec 12", time: "9:00 AM - 6:00 PM" },
]

export default function Home() {
  return (
    <section>
      <h1 className="text-center">The Hub for Every Dev <br /> Event You Can't Miss</h1>
      <p className="text-center mt-5">Hackathons, Meetups and Conferences in one place</p>
      <ExploreBtn/>
      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>

        <ul className="events">
          {events.map((event:any) => (
            <li key={event.title}>
              <EventCard {...event} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
