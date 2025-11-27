import { useState, useEffect } from 'react';
import axios from 'axios';

const AttendanceMarking = () => {
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [period, setPeriod] = useState('1');
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [existingAttendance, setExistingAttendance] = useState(null);

  const API_URL = 'http://localhost:5000/api/faculty';

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      fetchStudents();
      checkExistingAttendance();
    }
  }, [selectedSubject, selectedDate, period]);

  const fetchSubjects = async () => {
    try {
      const token = localStorage.getItem('facultyToken');
      // This would fetch faculty's assigned subjects
      // For now using mock data - replace with actual API
      setSubjects([
        { id: 5, subject_code: 'CS301', subject_name: 'Data Structures', semester: 3 },
        { id: 6, subject_code: 'CS302', subject_name: 'DBMS', semester: 3 },
      ]);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('facultyToken');
      // This would fetch students for the selected subject
      // For now using mock data - replace with actual API
      const mockStudents = [
        { id: 101, usn: 'CSE21001', name: 'Student One' },
        { id: 102, usn: 'CSE21002', name: 'Student Two' },
        { id: 103, usn: 'CSE21003', name: 'Student Three' },
        { id: 104, usn: 'CSE21004', name: 'Student Four' },
        { id: 105, usn: 'CSE21005', name: 'Student Five' },
      ];
      
      setStudents(mockStudents);
      
      // Initialize attendance with all present
      const initialAttendance = {};
      mockStudents.forEach(student => {
        initialAttendance[student.id] = { status: 'present', remarks: '' };
      });
      setAttendance(initialAttendance);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const checkExistingAttendance = async () => {
    try {
      const token = localStorage.getItem('facultyToken');
      const response = await axios.get(
        `${API_URL}/attendance/subject`,
        {
          params: {
            subject_id: selectedSubject,
            date: selectedDate,
            period: period
          },
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.data.data && response.data.data.length > 0) {
        setExistingAttendance(response.data.data);
        
        // Pre-fill with existing attendance
        const existingData = {};
        response.data.data.forEach(record => {
          existingData[record.student_id] = {
            status: record.status,
            remarks: record.remarks || ''
          };
        });
        setAttendance(existingData);
      } else {
        setExistingAttendance(null);
      }
    } catch (error) {
      console.error('Error checking existing attendance:', error);
      setExistingAttendance(null);
    }
  };

  const handleAttendanceChange = (studentId, field, value) => {
    setAttendance({
      ...attendance,
      [studentId]: {
        ...attendance[studentId],
        [field]: value
      }
    });
  };

  const markAllPresent = () => {
    const updatedAttendance = {};
    students.forEach(student => {
      updatedAttendance[student.id] = { status: 'present', remarks: '' };
    });
    setAttendance(updatedAttendance);
  };

  const markAllAbsent = () => {
    const updatedAttendance = {};
    students.forEach(student => {
      updatedAttendance[student.id] = { status: 'absent', remarks: '' };
    });
    setAttendance(updatedAttendance);
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

      const attendanceRecords = students.map(student => ({
        student_id: student.id,
        status: attendance[student.id]?.status || 'absent',
        remarks: attendance[student.id]?.remarks || ''
      }));

      await axios.post(
        `${API_URL}/attendance/bulk`,
        {
          subject_id: parseInt(selectedSubject),
          date: selectedDate,
          period: parseInt(period),
          attendance_records: attendanceRecords
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert('Attendance marked successfully!');
    } catch (error) {
      console.error('Error marking attendance:', error);
      alert(error.response?.data?.message || 'Failed to mark attendance');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'bg-green-500';
      case 'absent': return 'bg-red-500';
      case 'late': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getAttendanceCount = () => {
    const present = Object.values(attendance).filter(a => a.status === 'present').length;
    const absent = Object.values(attendance).filter(a => a.status === 'absent').length;
    const late = Object.values(attendance).filter(a => a.status === 'late').length;
    return { present, absent, late };
  };

  const counts = getAttendanceCount();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Mark Attendance</h2>

        {/* Date and Subject Selection */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                Date *
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Period *
              </label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(p => (
                  <option key={p} value={p}>Period {p}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end gap-2">
              <button
                type="button"
                onClick={markAllPresent}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
              >
                All Present
              </button>
              <button
                type="button"
                onClick={markAllAbsent}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
              >
                All Absent
              </button>
            </div>
          </div>

          {existingAttendance && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ Attendance already marked for this date and period. Submitting will update the existing records.
              </p>
            </div>
          )}
        </div>

        {/* Attendance Summary */}
        {selectedSubject && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-green-100 rounded-lg p-4">
              <p className="text-sm text-green-700 font-medium">Present</p>
              <p className="text-3xl font-bold text-green-800">{counts.present}</p>
            </div>
            <div className="bg-red-100 rounded-lg p-4">
              <p className="text-sm text-red-700 font-medium">Absent</p>
              <p className="text-3xl font-bold text-red-800">{counts.absent}</p>
            </div>
            <div className="bg-yellow-100 rounded-lg p-4">
              <p className="text-sm text-yellow-700 font-medium">Late</p>
              <p className="text-3xl font-bold text-yellow-800">{counts.late}</p>
            </div>
          </div>
        )}

        {/* Student List */}
        {selectedSubject && students.length > 0 && (
          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">USN</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student, index) => (
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
                        <div className="flex gap-2">
                          {['present', 'absent', 'late'].map(status => (
                            <button
                              key={status}
                              type="button"
                              onClick={() => handleAttendanceChange(student.id, 'status', status)}
                              className={`px-4 py-1 rounded-full text-xs font-medium transition ${
                                attendance[student.id]?.status === status
                                  ? `${getStatusColor(status)} text-white`
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                            >
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          value={attendance[student.id]?.remarks || ''}
                          onChange={(e) => handleAttendanceChange(student.id, 'remarks', e.target.value)}
                          placeholder="Optional remarks"
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        />
                      </td>
                    </tr>
                  ))}
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
              {loading ? 'Submitting...' : 'Submit Attendance'}
            </button>
          </form>
        )}

        {!selectedSubject && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500">Select a subject to start marking attendance</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceMarking;
