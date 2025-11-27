import { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StudentMarksView = () => {
  const [marksSummary, setMarksSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://localhost:5000/api/student';

  useEffect(() => {
    fetchMarksSummary();
  }, []);

  const fetchMarksSummary = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('studentToken');

      const response = await axios.get(`${API_URL}/marks/summary`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMarksSummary(response.data.data || []);
    } catch (error) {
      console.error('Error fetching marks summary:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGrade = (percentage) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    if (percentage >= 40) return 'D';
    return 'F';
  };

  const getGradeColor = (grade) => {
    if (grade.includes('A')) return 'text-green-600 bg-green-100';
    if (grade.includes('B')) return 'text-blue-600 bg-blue-100';
    if (grade.includes('C') || grade.includes('D')) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const overallPercentage = marksSummary.length > 0
    ? (marksSummary.reduce((sum, s) => sum + s.percentage, 0) / marksSummary.length).toFixed(2)
    : 0;

  const overallGrade = getGrade(overallPercentage);

  // Group marks by subject
  const groupedBySubject = marksSummary.reduce((acc, mark) => {
    const key = mark.subject_id;
    if (!acc[key]) {
      acc[key] = {
        subject_name: mark.subject_name,
        subject_code: mark.subject_code,
        marks: []
      };
    }
    acc[key].marks.push(mark);
    return acc;
  }, {});

  const chartData = {
    labels: Object.values(groupedBySubject).map(s => s.subject_code || s.subject_name),
    datasets: [
      {
        label: 'Average Percentage',
        data: Object.values(groupedBySubject).map(s => {
          const avg = s.marks.reduce((sum, m) => sum + m.percentage, 0) / s.marks.length;
          return avg.toFixed(2);
        }),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1
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
        text: 'Subject-wise Performance'
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
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">My Marks</h2>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading marks...</p>
          </div>
        ) : (
          <>
            {/* Overall Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                <p className="text-sm opacity-90">Overall Percentage</p>
                <p className="text-4xl font-bold mt-2">{overallPercentage}%</p>
                <p className="text-lg mt-2">Grade: {overallGrade}</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <p className="text-sm text-gray-600">Total Subjects</p>
                <p className="text-4xl font-bold text-gray-800 mt-2">
                  {Object.keys(groupedBySubject).length}
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <p className="text-sm text-gray-600">Total Exams</p>
                <p className="text-4xl font-bold text-blue-600 mt-2">
                  {marksSummary.length}
                </p>
              </div>
            </div>

            {/* Chart */}
            {Object.keys(groupedBySubject).length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <Bar data={chartData} options={chartOptions} />
              </div>
            )}

            {/* Subject-wise Details */}
            {Object.values(groupedBySubject).map((subject, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {subject.subject_name}
                  </h3>
                  <p className="text-sm text-gray-500">{subject.subject_code}</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Exam Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Marks Obtained
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Max Marks
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Percentage
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Grade
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {subject.marks.map((mark, i) => {
                        const grade = getGrade(mark.percentage);
                        return (
                          <tr key={i} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {mark.exam_type.replace(/_/g, ' ').toUpperCase()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {mark.marks_obtained}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {mark.max_marks}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                              {mark.percentage.toFixed(2)}%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${getGradeColor(grade)}`}>
                                {grade}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}

            {marksSummary.length === 0 && (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-500">No marks available yet.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StudentMarksView;
