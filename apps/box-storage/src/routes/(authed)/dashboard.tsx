import { createFileRoute } from "@tanstack/react-router"
import { getDashboardDataFn } from "@/data/actions"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, User, MoveRight } from "lucide-react"

export const Route = createFileRoute("/(authed)/dashboard")({
  component: RouteComponent,
  ssr: false,
  loader: async () => {
    return await getDashboardDataFn()
  },
})

function getLocationDisplay(item): string {
  if (item.box?.name) return item.box.name
  if (item.furniture?.name) return item.furniture.name
  if (item.room?.name) return item.room.name
  return "Unbekannt"
}

function RouteComponent() {
  const { personalItems, othersItems, recentlyModified } = Route.useLoaderData()

  // Filter personal items that are in motion
  const myItemsInMotion = personalItems.filter(
    (item) => item.inMotionUserId !== null,
  )

  return (
    <div className="space-y-6 mt-2">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Meine Gegenstände Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle>Meine Gegenstände</CardTitle>
              <CardDescription>Aktuell "In Bewegung"</CardDescription>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <MoveRight size={20} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myItemsInMotion.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {getLocationDisplay(item)}
                    </p>
                  </div>
                  <Badge variant="blue">In Bewegung</Badge>
                </div>
              ))}
              {myItemsInMotion.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-4">
                  Keine Gegenstände in Bewegung.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Fremde Gegenstände Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle>Fremde Gegenstände</CardTitle>
              <CardDescription>Gegenstände anderer User</CardDescription>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
              <User size={20} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {othersItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      Besitzer: {item.owner?.username || "Unbekannt"}
                    </p>
                  </div>
                  <Badge variant="outline">
                    {item.inMotionUserId ? "In Bewegung" : "Gelagert"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Kürzlich geändert Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle>Kürzlich geändert</CardTitle>
              <CardDescription>Die letzten 5 geänderten Items</CardDescription>
            </div>
            <div className="p-2 bg-green-50 rounded-lg text-green-600">
              <Activity size={20} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentlyModified.map((log) => (
                <div key={log.id} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-slate-900 leading-tight">
                      <span className="font-semibold">{log.name}</span>
                      {log.owner?.username && (
                        <>
                          {" "}
                          - gehört{" "}
                          <span className="font-semibold">
                            {log.owner?.username}
                          </span>
                        </>
                      )}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {log.updatedAt.toLocaleString("de-DE")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
