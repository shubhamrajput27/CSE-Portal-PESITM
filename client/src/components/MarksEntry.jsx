import { useState, useEffect } from 'react';
import axios from 'axios';

const MarksEntry = () => {
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [examType, setExamType] = useState('internal_1');
  const [maxMarks, setMaxMarks] = useState('50');
  const [marks, setMarks] = useState({});
  const [loading, setLoading] = useState(false);

  const API_URL = 'http://localhost:5000/api/faculty';

  const examTypes = [
    { value: 'internal_1', label: 'Internal Test 1' },
    { value: 'internal_2', label: 'Internal Test 2' },
    { value: 'internal_3', label: 'Internal Test 3' },
    { value: 'assignment', label: 'Assignment' },
    { value: 'quiz', label: 'Quiz' },
    { value: 'practical', label: 'Practical' },
    { value: 'seminar', label: 'Seminar' }
  ];

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      fetchStudents();
    }
  }, [selectedSubject]);

  const fetchSubjects = async () => {
    // Mock data - replace with actual API
    setSubjects([
      { id: 5, subject_code: 'CS301', subject_name: 'Data Structures' },
      { id: 6, subject_code: 'CS302', subject_name: 'DBMS' },
    ]);
  };

  const fetchStudents = async () => {
    // Mock data - replace with actual API
    const mockStudents = [
      { id: 101, usn: 'CSE21001', name: 'Student One' },
      { id: 102, usn: 'CSE21002', name: 'Student Two' },
      { id: 103, usn: 'CSE21003', name: 'Student Three' },
      { id: 104, usn: 'CSE21004', name: 'Student Four' },
      { id: 105, usn: 'CSE21005', name: 'Student Five' },
    ];
    
    setStudents(mockStudents);
    
    // Initialize marks with 0
    const initialMarks = {};
    mockStudents.forEach(student => {
      initialMarks[student.id] = { marks_obtained: '', remarks: '' };
    });
    setMarks(initialMarks);
  };

  const handleMarksChange = (studentId, field, value) => {
    setMarks({
      ...marks,
      [studentId]: {
        ...marks[studentId],
        [field]: value
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedSubject) {
      alert('Please select a subject');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('facultyToken');

      const marksRecords = students.map(student => ({
        student_id: student.id,
        marks_obtained: parseFloat(marks[student.id]?.marks_obtained || 0),
        remarks: marks[student.id]?.remarks || ''
      })).filter(record => record.marks_obtained > 0 || record.marks_obtained === 0);

      await axios.post(
        `${API_URL}/marks/bulk`,
        {
          subject_id: parseInt(selectedSubject),
          exam_type: examType,
          max_marks: parseFloat(maxMarks),
          marks_records: marksRecords
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert('Marks added successfully!');
    } catch (error) {
      console.error('Error adding marks:', error);
      alert(error.response?.data?.message || 'Failed to add marks');
    } finally {
      setLoading(false);
    }
  };

  const calculatePercentage = (obtained) => {
    if (!obtained || !maxMarks) return 0;
    return ((parseFloat(obtained) / parseFloat(maxMarks)) * 100).toFixed(2);
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

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Marks Entry</h2>

        {/* Subject and Exam Selection */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject *
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Subject</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>
                    {subject.subject_code} - {subject.subject_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Exam Type *
              </label>
              <select
                value={examType}
                onChange={(e) => setExamType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {examTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Marks *
              </label>
              <input
                type="number"
                value={maxMarks}
                onChange={(e) => setMaxMarks(e.target.value)}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Marks Entry Table */}
        {selectedSubject && students.length > 0 && (
          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">USN</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marks Obtained</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Percentage</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student, index) => {
                    const percentage = calculatePercentage(marks[student.id]?.marks_obtained);
                    const grade = getGrade(percentage);
                    
                    return (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {student.usn}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {student.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            value={marks[student.id]?.marks_obtained || ''}
                            onChange={(e) => handleMarksChange(student.id, 'marks_obtained', e.target.value)}
                            min="0"
                            max={maxMarks}
                            step="0.5"
                            className="w-24 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                            placeholder="0"
                          />
                          <span className="ml-2 text-sm text-gray-500">/ {maxMarks}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {percentage}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            grade === 'F' ? 'bg-red-100 text-red-800' :
                            grade.includes('A') ? 'bg-green-100 text-green-800' :
                            grade.includes('B') ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {grade}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            value={marks[student.id]?.remarks || ''}
                            onChange={(e) => handleMarksChange(student.id, 'remarks', e.target.value)}
                            placeholder="Optional"
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold text-white transition ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Submitting...' : 'Submit Marks'}
            </button>
          </form>
        )}

        {!selectedSubject && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500">Select a subject to start entering marks</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarksEntry;
