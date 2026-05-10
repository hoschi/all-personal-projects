import { ForecastTimelineData } from "@/server/types"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  VariableCosts,
  ForecastDataInitializer,
  Timeline,
  SaveForecast,
} from "@/components/forecastState"
import { eurFormatter } from "@/components/format"

export function Forecast({
  forecastData,
}: {
  forecastData: ForecastTimelineData
}) {
  return (
    <div className="flex flex-col h-dvh">
      <ForecastDataInitializer forecastData={forecastData} />
      <header className="flex items-center gap-2 m-3 ml-8">
        <SidebarTrigger className="-ml-1 mr-3" />
        <div className="flex flex-col grow">
          <h1 className="text-3xl">Forecast</h1>
          <h2 className="text-muted-foreground">Where the Future starts</h2>
          <ForecastHeader forecastData={forecastData} />
        </div>
      </header>
      <Timeline forecastData={forecastData} />
    </div>
  )
}

export function ForecastHeader({
  forecastData,
}: {
  forecastData: ForecastTimelineData
}) {
  const startAmount = forecastData.startAmount

  return (
    <div className="flex flex-col">
      <div>start:{eurFormatter.format(startAmount / 100)}</div>
      <VariableCosts recurringItems={forecastData.recurringItems} />
      <SaveForecast forecastData={forecastData} />
    </div>
  )
}
