import { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { ArrowLeft } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StudentAttendanceView = ({ onBack }) => {
  const [attendanceSummary, setAttendanceSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [selectedSubject, setSelectedSubject] = useState(null);
  const [dateRange, setDateRange] = useState({
    start_date: '',
    end_date: new Date().toISOString().split('T')[0]
  });

  const API_URL = 'http://localhost:5000/api/student';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetchAttendanceSummary();
  }, [dateRange]);

  const fetchAttendanceSummary = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('studentToken');
      
      const params = {};
      if (dateRange.start_date) params.start_date = dateRange.start_date;
      if (dateRange.end_date) params.end_date = dateRange.end_date;

      const response = await axios.get(`${API_URL}/attendance/summary`, {
        params,
        headers: { Authorization: `Bearer ${token}` }
      });

      setAttendanceSummary(response.data.data || []);
    } catch (error) {
      console.error('Error fetching attendance summary:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAttendanceColor = (percentage) => {
    if (percentage >= 85) return 'text-green-600 bg-green-100';
    if (percentage >= 75) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getProgressBarColor = (percentage) => {
    if (percentage >= 85) return 'bg-green-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const overallAttendance = attendanceSummary.length > 0
    ? (attendanceSummary.reduce((sum, s) => sum + s.attendance_percentage, 0) / attendanceSummary.length).toFixed(2)
    : 0;

  const chartData = {
    labels: attendanceSummary.map(s => s.subject_code || s.subject_name),
    datasets: [
      {
        label: 'Attendance %',
        data: attendanceSummary.map(s => s.attendance_percentage),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Subject-wise Attendance Percentage'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <ArrowLeft size={20} />
              Back to Dashboard
            </button>
          )}
          <h2 className="text-3xl font-bold text-gray-800">My Attendance</h2>
        </div>

        {/* Date Range Filter */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <input
                type="date"
                value={dateRange.start_date}
                onChange={(e) => setDateRange({ ...dateRange, start_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                value={dateRange.end_date}
                onChange={(e) => setDateRange({ ...dateRange, end_date: e.target.value })}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={fetchAttendanceSummary}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Apply Filter
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading attendance...</p>
          </div>
        ) : (
          <>
            {/* Overall Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                <p className="text-sm opacity-90">Overall Attendance</p>
                <p className="text-4xl font-bold mt-2">{overallAttendance}%</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <p className="text-sm text-gray-600">Total Subjects</p>
                <p className="text-4xl font-bold text-gray-800 mt-2">{attendanceSummary.length}</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <p className="text-sm text-gray-600">Classes Attended</p>
                <p className="text-4xl font-bold text-green-600 mt-2">
                  {attendanceSummary.reduce((sum, s) => sum + s.present_count, 0)}
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <p className="text-sm text-gray-600">Classes Missed</p>
                <p className="text-4xl font-bold text-red-600 mt-2">
                  {attendanceSummary.reduce((sum, s) => sum + s.absent_count, 0)}
                </p>
              </div>
            </div>

            {/* Chart */}
            {attendanceSummary.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <Line data={chartData} options={chartOptions} />
              </div>
            )}

            {/* Subject-wise Details */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Subject-wise Breakdown</h3>
              </div>
              
              {attendanceSummary.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {attendanceSummary.map((subject, index) => (
                    <div key={index} className="p-6 hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-800">
                            {subject.subject_name}
                          </h4>
                          <p className="text-sm text-gray-500">{subject.subject_code}</p>
                        </div>
                        <span className={`px-4 py-2 rounded-full font-bold text-lg ${getAttendanceColor(subject.attendance_percentage)}`}>
                          {subject.attendance_percentage.toFixed(2)}%
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-gray-500">Total Classes</p>
                          <p className="text-xl font-bold text-gray-800">{subject.total_classes}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Present</p>
                          <p className="text-xl font-bold text-green-600">{subject.present_count}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Absent</p>
                          <p className="text-xl font-bold text-red-600">{subject.absent_count}</p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${getProgressBarColor(subject.attendance_percentage)}`}
                          style={{ width: `${subject.attendance_percentage}%` }}
                        ></div>
                      </div>

                      {subject.attendance_percentage < 75 && (
                        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
                          <p className="text-xs text-red-700">
                            ⚠️ Below minimum requirement (75%). Attend {Math.ceil((0.75 * subject.total_classes - subject.present_count) / 0.25)} more classes to reach 75%.
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center text-gray-500">
                  No attendance records found for the selected date range.
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentAttendanceView;
