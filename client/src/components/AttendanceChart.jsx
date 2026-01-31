import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Award, AlertCircle } from 'lucide-react';

const AttendanceChart = ({ data, type = 'line' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No attendance data available</p>
      </div>
    );
  }

  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (type === 'line') {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="date" stroke="#6B7280" />
          <YAxis stroke="#6B7280" domain={[0, 100]} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="percentage"
            stroke="#4F46E5"
            strokeWidth={2}
            dot={{ fill: '#4F46E5', r: 4 }}
            activeDot={{ r: 6 }}
            name="Attendance %"
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  if (type === 'bar') {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="subject" stroke="#6B7280" />
          <YAxis stroke="#6B7280" domain={[0, 100]} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="percentage" fill="#4F46E5" name="Attendance %" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (type === 'pie') {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  return null;
};

const AttendanceStats = ({ attendancePercentage, trend }) => {
  const getStatusColor = (percentage) => {
    if (percentage >= 75) return 'text-green-600 bg-green-50';
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getStatusIcon = (percentage) => {
    if (percentage >= 75) return <Award className="text-green-600" size={24} />;
    return <AlertCircle className="text-red-600" size={24} />;
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return <TrendingUp className="text-green-600" size={20} />;
    if (trend < 0) return <TrendingDown className="text-red-600" size={20} />;
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white rounded-lg p-6 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Overall Attendance</p>
            <p className={`text-3xl font-bold ${getStatusColor(attendancePercentage)}`}>
              {attendancePercentage}%
            </p>
          </div>
          {getStatusIcon(attendancePercentage)}
        </div>
        {trend !== undefined && (
          <div className="flex items-center gap-1 mt-2">
            {getTrendIcon(trend)}
            <span className={`text-sm ${trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-600'}`}>
              {Math.abs(trend)}% from last month
            </span>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg p-6 shadow-md">
        <p className="text-sm text-gray-600 mb-1">Classes Attended</p>
        <p className="text-3xl font-bold text-indigo-600">85</p>
        <p className="text-sm text-gray-500 mt-2">Out of 100 classes</p>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-md">
        <p className="text-sm text-gray-600 mb-1">Status</p>
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${getStatusColor(attendancePercentage)}`}>
          <div className="w-2 h-2 rounded-full bg-current"></div>
          <span className="font-semibold">
            {attendancePercentage >= 75 ? 'Good Standing' : attendancePercentage >= 60 ? 'At Risk' : 'Below Requirement'}
          </span>
        </div>
      </div>
    </div>
  );
};

export { AttendanceChart, AttendanceStats };
