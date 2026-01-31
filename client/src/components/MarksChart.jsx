import { BarChart, Bar, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Trophy, Target, TrendingUp } from 'lucide-react';

const MarksChart = ({ data, type = 'bar' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No marks data available</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (type === 'bar') {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="subject" stroke="#6B7280" />
          <YAxis stroke="#6B7280" domain={[0, 100]} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="marks" fill="#4F46E5" name="Marks Obtained" radius={[8, 8, 0, 0]} />
          <Bar dataKey="average" fill="#10B981" name="Class Average" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (type === 'line') {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="exam" stroke="#6B7280" />
          <YAxis stroke="#6B7280" domain={[0, 100]} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="percentage"
            stroke="#4F46E5"
            strokeWidth={2}
            dot={{ fill: '#4F46E5', r: 4 }}
            name="Percentage"
          />
          <Line
            type="monotone"
            dataKey="average"
            stroke="#10B981"
            strokeWidth={2}
            dot={{ fill: '#10B981', r: 4 }}
            name="Class Average"
            strokeDasharray="5 5"
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  if (type === 'radar') {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={data}>
          <PolarGrid stroke="#E5E7EB" />
          <PolarAngleAxis dataKey="subject" stroke="#6B7280" />
          <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#6B7280" />
          <Radar
            name="Your Marks"
            dataKey="marks"
            stroke="#4F46E5"
            fill="#4F46E5"
            fillOpacity={0.6}
          />
          <Radar
            name="Class Average"
            dataKey="average"
            stroke="#10B981"
            fill="#10B981"
            fillOpacity={0.3}
          />
          <Legend />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    );
  }

  return null;
};

const MarksStats = ({ cgpa, sgpa, rank, totalStudents }) => {
  const getGradeColor = (cgpa) => {
    if (cgpa >= 9) return 'text-green-600 bg-green-50';
    if (cgpa >= 8) return 'text-blue-600 bg-blue-50';
    if (cgpa >= 7) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getGrade = (cgpa) => {
    if (cgpa >= 9) return 'A+';
    if (cgpa >= 8.5) return 'A';
    if (cgpa >= 8) return 'A-';
    if (cgpa >= 7.5) return 'B+';
    if (cgpa >= 7) return 'B';
    if (cgpa >= 6.5) return 'B-';
    if (cgpa >= 6) return 'C+';
    if (cgpa >= 5.5) return 'C';
    return 'D';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg p-6 shadow-md text-white">
        <div className="flex items-center justify-between mb-2">
          <p className="text-indigo-100 text-sm">CGPA</p>
          <Trophy size={20} className="text-indigo-200" />
        </div>
        <p className="text-4xl font-bold">{cgpa.toFixed(2)}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="px-2 py-1 bg-white bg-opacity-20 rounded text-sm font-semibold">
            {getGrade(cgpa)}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-md">
        <div className="flex items-center justify-between mb-2">
          <p className="text-gray-600 text-sm">SGPA (Current Sem)</p>
          <Target size={20} className="text-indigo-600" />
        </div>
        <p className="text-3xl font-bold text-gray-900">{sgpa.toFixed(2)}</p>
        <p className="text-sm text-gray-500 mt-2">{getGrade(sgpa)} Grade</p>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-md">
        <div className="flex items-center justify-between mb-2">
          <p className="text-gray-600 text-sm">Class Rank</p>
          <TrendingUp size={20} className="text-green-600" />
        </div>
        <p className="text-3xl font-bold text-gray-900">#{rank}</p>
        <p className="text-sm text-gray-500 mt-2">Out of {totalStudents} students</p>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-md">
        <p className="text-gray-600 text-sm mb-2">Performance</p>
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block text-indigo-600">
                {((cgpa / 10) * 100).toFixed(0)}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-100">
            <div
              style={{ width: `${(cgpa / 10) * 100}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600 transition-all duration-500"
            ></div>
          </div>
        </div>
        <p className="text-sm text-gray-500">Overall Progress</p>
      </div>
    </div>
  );
};

export { MarksChart, MarksStats };
