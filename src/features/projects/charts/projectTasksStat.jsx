import { useEffect, useState } from "react";
import supabase from '../../../lib/supabase';
import { useTheme } from "../../../../context/themeContext";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const chartConfig = {
  totalNumberOfUserProjectTasks: {
    label: "Total number of user tasks",
    color: "hsl(var(--chart-1))",
  },
  label: {
    color: "hsl(var(--background))",
  },
}


function ProjectTasksStat() {
  const { theme } = useTheme();
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchProjectTasks();
  }, []);

  async function fetchProjectTasks() {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        id,
        name,
        created_at,
        tasks (
          id,
          title,
          profiles (
            id,
            username
          )
        )
      `);

    if (error) {
      throw new Error('Error fetching projects:', error.message);
    }

    const taskCounts = {};
    data.forEach(project => {
      project.tasks.forEach(task => {
        const date = new Date(project.created_at);
        const month = date.toLocaleString('default', { month: 'long' });
        const user = task.profiles.username.replace(/['"]+/g, '');
        
        if (!taskCounts[month]) {
          taskCounts[month] = {};
        }
        if (!taskCounts[month][user]) {
          taskCounts[month][user] = 0;
        }
        taskCounts[month][user]++;
      });
    });

    const months = [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();

    let formattedData = [];
    for (let i = 0; i < 6; i++) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const month = months[monthIndex];
      
      if (taskCounts[month]) {
        formattedData = formattedData.concat(
          Object.entries(taskCounts[month]).map(([user, count]) => ({
            month,
            totalNumberOfUserProjectTasks: count,
            user
          }))
        );
      } else {
        formattedData.push({
          month,
          totalNumberOfUserProjectTasks: 0,
          user: ''
        });
      }
    }

    // Reverse the array so that the oldest month comes first
    formattedData.reverse();
    setChartData(formattedData);
  }

  return (
    <Card className={`${theme === 'dark' ? 'bg-base-100 border-none' :'bg-white'} w-full lg:w-1/2`}>
      <CardHeader>
        <CardTitle className="text-base-content">Task Metrics</CardTitle>
        <CardDescription className="text-base-content">{chartData[0]?.month + ' - ' + chartData[chartData.length - 1]?.month} 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ right: 16 }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="month"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              className="text-base-content"
            />
            <XAxis dataKey="totalNumberOfUserProjectTasks" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="totalNumberOfUserProjectTasks"
              layout="vertical"
              fill="var(--color-totalNumberOfUserProjectTasks)"
              radius={4}
            >
              <LabelList
                dataKey="user"
                position="insideLeft"
                offset={8}
                className={`${theme == 'dark' ? 'fill-base-100' : 'fill-white'} `}
                fontSize={12}
              />
              <LabelList
                dataKey="totalNumberOfUserProjectTasks"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default ProjectTasksStat;