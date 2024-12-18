import { useEffect, useState } from "react";
import { useTheme } from "../../../../context/themeContext";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const chartConfig = {
  views: {
    label: "Number Of Projects",
  },
  projects: {
    label: "projects",
    color: "hsl(var(--chart-1))",
  },
}

export default function ProjectBarChart({ projects }) {
  const [chartData, setChartData] =  useState([])
  const { theme } = useTheme();

  useEffect(() => {
    const projectCounts = {};
    projects.forEach(project => {
      const date = project.created_at.split('T')[0]; // Extract date part
      projectCounts[date] = (projectCounts[date] || 0) + 1;
    });

    const formattedData = Object.entries(projectCounts).map(([date, count]) => ({
      date,
      projects: count
    }));

    setChartData(formattedData);
  }, [projects]);
  

  return (
    <Card className={`${theme === 'dark' ? 'bg-base-100 border-none' :'bg-base-100'}`}>
      <CardHeader className="flex flex-col items-stretch space-y-0 p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle className="text-base-content">Bar Chart</CardTitle>
          <CardDescription className="text-base-content">
            Showing total projects for the last 3 months
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                />
              }
            />
            <Bar dataKey={'projects'} fill={`var(--color-${'projects'})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
