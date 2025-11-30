import { getCurrentEvents, getPastEvents } from "@/actions/events";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, User, Users } from "lucide-react";

// Type definition for Event (matches Prisma schema)
interface Event {
  id: number;
  title: string;
  description: string;
  Date: Date;
  Time: string;
  venue: string;
  organizer: string;
  coOrganizer: string | null;
  keyHighlights: string[];
  tags: string[];
  status: string;
}

export default async function EventsManagePage() {
  const [currentEventsResult, pastEventsResult] = await Promise.all([
    getCurrentEvents(),
    getPastEvents(),
  ]);

  const currentEvents = currentEventsResult.success
    ? currentEventsResult.data ?? []
    : [];
  const pastEvents = pastEventsResult.success
    ? pastEventsResult.data ?? []
    : [];

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "upcoming":
        return "bg-blue-500";
      case "ongoing":
        return "bg-green-500";
      case "completed":
        return "bg-gray-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Events Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage and view all GDG events
        </p>
      </div>

      {/* Current/Upcoming Events Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></span>
          Current & Upcoming Events
        </h2>
        {currentEvents && currentEvents.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {currentEvents.map((event: Event) => (
              <Card
                key={event.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <Badge
                      className={`${getStatusColor(event.status)} text-white`}
                    >
                      {event.status}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {event.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(event.Date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{event.Time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{event.venue}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>{event.organizer}</span>
                    {event.coOrganizer && (
                      <>
                        <Users className="h-4 w-4 ml-2" />
                        <span>{event.coOrganizer}</span>
                      </>
                    )}
                  </div>
                  {event.tags && event.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-2">
                      {event.tags.map((tag: string, index: number) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {event.keyHighlights && event.keyHighlights.length > 0 && (
                    <div className="pt-2 border-t">
                      <p className="text-xs font-medium mb-1">
                        Key Highlights:
                      </p>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {event.keyHighlights
                          .slice(0, 3)
                          .map((highlight: string, index: number) => (
                            <li key={index} className="flex items-start gap-1">
                              <span className="text-green-500">•</span>
                              {highlight}
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">
              No upcoming events scheduled
            </p>
          </Card>
        )}
      </section>

      {/* Past Events Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Past Events</h2>
        {pastEvents && pastEvents.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pastEvents.map((event: Event) => (
              <Card
                key={event.id}
                className="opacity-75 hover:opacity-100 transition-opacity"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <Badge variant="secondary">{event.status}</Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {event.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(event.Date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{event.venue}</span>
                  </div>
                  {event.tags && event.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-2">
                      {event.tags.map((tag: string, index: number) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No past events found</p>
          </Card>
        )}
      </section>
    </div>
  );
}
