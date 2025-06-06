import { useTheme } from "../../../../context/themeContext";
import CardWrapper from "../../../components/ui/cardWrapper";

function ProjectStatusOverview({ filteredStatus, projectCounts, increaseRates, showIcons = true }) {
  const { theme } = useTheme();

  const getStatusIcon = (status) => {
    const icons = {
      'total projects': 'pi-book text-blue-400',
      'in review': 'pi-stopwatch text-red-400',
      'done': 'pi-check-circle text-green-400',
      'todo': 'pi-list text-gray-400',
      'in progress': 'pi-sync text-orange-400'
    };

    return [{
      icon: `pi ${icons[status]}`,
      class: `${theme === 'light' ? `bg-${status.split(' ')[0]}-50` : 'bg-[#191E24]'} py-1 px-2 rounded-sm`
    }];
  };

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {projectCounts && Object.entries(projectCounts)
        .filter(([status]) => status.toLowerCase() != filteredStatus)
        .map(([status, count]) => (
          <li key={status}>
            <CardWrapper 
              subtitle={status} 
              containerClass="w-full capitalize h-40 lg:h-auto"
              text={count.toString()}
              buttons={showIcons ? getStatusIcon(status) : undefined}
            >
              <span className="text-sm text-muted-foreground">
                {increaseRates[status] > 0 ? '+' : ''}{increaseRates[status]}% increase
              </span>
            </CardWrapper>
          </li>
        ))}
    </ul>
  );
}

export default ProjectStatusOverview;