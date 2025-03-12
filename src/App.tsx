import { MultiSelect } from "./components/ui/multi-select";

const OPTIONS = [
  { value: "line_chart", label: "Line chart" },
  { value: "bar_chart", label: "Bar chart" },
  { value: "pie_chart", label: "Pie chart" },
  { value: "column_chart", label: "Column chart" },
  { value: "area_chart", label: "Area chart" },
  { value: "scatter_chart", label: "Scatter chart" },
  { value: "radar_chart", label: "Radar chart" },
  { value: "doughnut_chart", label: "Doughnut chart" },
  { value: "polar_chart", label: "Polar chart" },
  { value: "bubble_chart", label: "Bubble chart" },
];

function App() {
  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8 pt-20 pb-16 lg:pt-32">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-600">Chart type</label>

        <MultiSelect
          options={OPTIONS}
          value={OPTIONS.slice(0, 3)}
          onChange={(selected) => console.log(selected)}
        />
      </div>
    </div>
  );
}

export default App;
