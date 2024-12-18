/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import supabase from '../../../lib/supabase';
import { Label, Pie, PieChart } from "recharts";
import { useToast } from "@/components/ui/use-toast";
import { useTheme } from "../../../../context/themeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
const colors = ["var(--color-edge)", "var(--color-other)", "var(--color-edge)"]

const chartConfig = {
  visitors: {
    label: "totalProjects",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
}

function PriorityLevelStat() {
  const { toast } = useToast();
  const { theme } = useTheme();
  const [chartData, setChartData] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function getPriority(dueDate) {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due - now;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays <= 1) return 'High';
    if (diffDays <= 7) return 'Medium';
    return 'Low';
  }

  async function fetchProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('id, due_date');

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while fetching the project. Please refresh page.",
      })
      return;
    }

    const priorityCounts = {
      High: 0,
      Medium: 0,
      Low: 0
    };
    setProjects(data)

    data.forEach(project => {
      const priority = getPriority(project.due_date);
      priorityCounts[priority]++;
    });

    const formattedData = Object.entries(priorityCounts).map(([priority, count], index) => ({
      priority,
      totalProjects: count,
      fill: colors[index]
    }));

    setChartData(formattedData);
  }

  return (
    <Card className={`${theme === 'dark' ? 'bg-base-100 border-none' :'bg-base-100'}`}>
      <CardHeader className="text-base-content pb-0">
        <CardTitle>Priority Level</CardTitle>
        {/* <CardDescription>January - June 2024</CardDescription> */}
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[850px] w-[450px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="totalProjects"
              nameKey="priority"
              innerRadius={100}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-base-content text-3xl font-bold"
                        >
                          {projects.length.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-base-content"
                        >
                          Projects
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default PriorityLevelStat;