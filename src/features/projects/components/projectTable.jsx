import supabase from '../../../lib/supabase';
import { Input } from "@/components/ui/input";
import { useMemo, useState, useEffect } from 'react';
import { useTheme } from "../../../../context/themeContext";
import { format, parseISO, isWithinInterval } from 'date-fns';
import { DatePickerWithRange } from '../../../components/ui/datePickerWithRange';
import { 
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const ProjectTable = () => {
  const { theme } = useTheme();
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState([]);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [progressData, setProgressData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProjectProgress();
  }, []);

  async function fetchProjectProgress() {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('projects')
      .select(`
        id,
        name,
        created_at,
        tasks (
          id,
          title,
          completed,
          profiles (
            id,
            username
          )
        )
      `);

    if (error) {
      throw new Error('Error fetching projects:', error);
    }

    const progressData = data.flatMap(project => {
      const userTaskCounts = {};

      project.tasks.forEach(task => {
        const userName = task.profiles.username;
        if (!userTaskCounts[userName]) {
          userTaskCounts[userName] = { completed: 0, total: 0 };
        }
        userTaskCounts[userName].total++;
        if (task.completed) {
          userTaskCounts[userName].completed++;
        }
      });

      return Object.entries(userTaskCounts).map(([name, counts]) => ({
        name: name.replace(/['"]+/g, ''),
        project: project.name,
        tasksCompleted: counts.completed,
        totalTasks: counts.total,
        date: new Date(project.created_at).toISOString().split('T')[0]
      }));
    });

    setProgressData(progressData);
    setIsLoading(false);
  }

  const columns = useMemo(
    () => [
      {
        header: 'Name',
        accessorKey: 'name',
      },
      {
        header: 'Project',
        accessorKey: 'project',
      },
      {
        header: 'Tasks Completed',
        accessorKey: 'tasksCompleted',
      },
      {
        header: 'Total Tasks',
        accessorKey: 'totalTasks',
      },
      {
        header: 'Completion Rate',
        accessorFn: (row) => (row.tasksCompleted / row.totalTasks) * 100,
        id: 'completionRate',
        cell: ({ getValue }) => {
          const value = getValue();
          return (
            <div className='flex gap-2 '>
              {value.toFixed(0)}%
              <div className='w-[100px] bg-base-300 mt-1.5'>
                <div
                  style={{
                    width: `${value}%`,
                    height: '100%',
                    backgroundColor: '#4CAF50',
                  }}
                />
              </div>
            </div>
          );
        },
      },
      {
        header: 'Date',
        accessorKey: 'date',
        cell: ({ getValue }) => format(getValue(), 'yyyy-MM-dd'),
      },
    ],
    []
  );

  const table = useReactTable({
    data: progressData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId);
      return String(value).toLowerCase().includes(filterValue.toLowerCase());
    },
    state: {
      globalFilter,
      columnFilters,
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    filterFns: {
      dateRangeFilter: (row, columnId, filterValue) => {
        if (!filterValue.start || !filterValue.end) return true;
        const rowDate = row.getValue(columnId);
        return isWithinInterval(rowDate, {
          start: parseISO(filterValue.start),
          end: parseISO(filterValue.end),
        });
      },
      completionRangeFilter: (row, columnId, filterValue) => {
        if (!filterValue) return true;
        const completionRate = row.getValue(columnId);
        const [min, max] = filterValue.split('-').map(Number);
        return completionRate >= min && completionRate <= max;
      },

    },
  });

  const handleProjectFilter = (project) => {
    table.getColumn('project').setFilterValue(project);
  };

  const handleCompletionRangeFilter = (range) => {
    table.getColumn('completionRate').setFilterValue(range);
  };


  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (progressData.length === 0) {
  return <div>No data available</div>;
}

  return (
    <div className='bg-base-100 p-4'>
      <div className='flex justify-between items-center my-2'>
        <Input 
        type="text" 
        placeholder="Search..." 
        value={globalFilter ?? ''}
        onChange={(e) => setGlobalFilter(e.target.value)}  
        className="w-48 border-base-300 max-w-md"
        />
        <div className='flex gap-x-2'>

        <Select 
          onValueChange={handleProjectFilter}
          value={table.getColumn('project').getFilterValue() ?? ''}
        >
          <SelectTrigger className={ `${theme == 'dark' ? 'bg-base-100 border-base-300' : 'bg-base-100'} w-[180px]`}>
            <SelectValue placeholder="All Projects" />
          </SelectTrigger>
          <SelectContent className={`${theme == 'dark' ? 'bg-base-100 ' : 'bg-base-100'}`}>
            <SelectGroup >
              <SelectItem defaultValue="">All Projects</SelectItem>
              <SelectItem value="Project A">Project A</SelectItem>
              <SelectItem value="Project B">Project B</SelectItem>
              <SelectItem value="Project C">Project C</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <DatePickerWithRange dateRange={dateRange} setDateRange={setDateRange}/>
        <Select 
          onValueChange={handleCompletionRangeFilter}
          value={table.getColumn('completionRate').getFilterValue() ?? ''}
        >
          <SelectTrigger className={ `${theme == 'dark' ? 'bg-base-100 border-base-300' : 'bg-base-100'} w-[180px]`}>
            <SelectValue placeholder="All Completion Rates" />
          </SelectTrigger>
          <SelectContent className={`${theme == 'dark' ? 'bg-base-100 ' : 'bg-base-100'}`}>
            <SelectGroup >
              <SelectItem defaultValue="">All Completion Rates</SelectItem>
              <SelectItem value="0-25">0-25</SelectItem>
              <SelectItem value="26-50">26-50</SelectItem>
              <SelectItem value="51-75">51-75</SelectItem>
              <SelectItem value="76-100">76-100</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        </div>
      </div>
      <table className='table table-sm w-full'>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} onClick={header.column.getToggleSortingHandler()}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {{
                    asc: ' 🔼',
                    desc: ' 🔽',
                  }[header.column.getIsSorted()] ?? null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className='pt-4 flex items-center gap-x-4'>
        <button
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
        <span>
          Page{' '}
          <strong>
            {table.getState().pagination.pageIndex + 1} of {' '}
            {table.getPageCount()}
          </strong>{' '}
        </span>
      </div>
    </div>
  );
};

export default ProjectTable;