import { useState, useEffect } from 'react'
import axios from 'axios'
import { API_ENDPOINTS } from '../config/api'
import FacultyNavbar from './FacultyNavbar'

const MarksEntry = ({ onBack }) => {
  const [subjects, setSubjects] = useState([])
  const [students, setStudents] = useState([])
  const [selectedSubject, setSelectedSubject] = useState('')
  const [examType, setExamType] = useState('internal_1')
  const [maxMarks, setMaxMarks] = useState('50')
  const [marks, setMarks] = useState({})
  const [loading, setLoading] = useState(false)
  const [subjectLoading, setSubjectLoading] = useState(false)
  const [studentsLoading, setStudentsLoading] = useState(false)
  const [error, setError] = useState('')

  const token = localStorage.getItem('facultyToken')
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {}

  const examTypes = [
    { value: 'internal_1', label: 'Internal Test 1' },
    { value: 'internal_2', label: 'Internal Test 2' },
    { value: 'internal_3', label: 'Internal Test 3' },
    { value: 'assignment', label: 'Assignment' },
    { value: 'quiz', label: 'Quiz' },
    { value: 'practical', label: 'Practical' },
    { value: 'seminar', label: 'Seminar' }
  ]

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    fetchSubjects()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (selectedSubject) {
      fetchStudents(selectedSubject)
    } else {
      setStudents([])
      setMarks({})
    }
  }, [selectedSubject])

  const fetchSubjects = async () => {
    if (!token) {
      setError('Faculty session expired. Please log in again.')
      return
    }

    setSubjectLoading(true)
    setError('')

    try {
      const response = await axios.get(API_ENDPOINTS.FACULTY_SUBJECTS, {
        headers: authHeaders
      })

      const fetched = response.data?.data || []
      setSubjects(fetched)

      if (!selectedSubject && fetched.length > 0) {
        setSelectedSubject(String(fetched[0].id))
      }

      if (fetched.length === 0) {
        setError('No subjects have been assigned to you yet.')
      }
    } catch (err) {
      console.error('Fetch subjects error:', err)
      setSubjects([])
      setError('Unable to load subjects. Please refresh the page.')
    } finally {
      setSubjectLoading(false)
    }
  }

  const fetchStudents = async (subjectId) => {
    if (!token) {
      setError('Faculty session expired. Please log in again.')
      return
    }

    setStudentsLoading(true)
    setError('')

    try {
      const subject = subjects.find((sub) => `${sub.id}` === `${subjectId}`)
      const params = {}

      if (subject?.academic_year) {
        params.academic_year = subject.academic_year
      }

      const response = await axios.get(
        `${API_ENDPOINTS.FACULTY_STUDENTS_BY_SUBJECT}/${subjectId}`,
        {
          headers: authHeaders,
          params
        }
      )

      const fetched = response.data?.data || []
      setStudents(fetched)

      const initialMarks = fetched.reduce((acc, student) => {
        acc[student.id] = { marks_obtained: '', remarks: '' }
        return acc
      }, {})

      setMarks(initialMarks)

      if (fetched.length === 0) {
        setError('No students found for the selected subject.')
      }
    } catch (err) {
      console.error('Fetch students error:', err)
      setStudents([])
      setMarks({})
      setError('Unable to load students. Please try again.')
    } finally {
      setStudentsLoading(false)
    }
  }

  const handleMarksChange = (studentId, field, value) => {
    setMarks((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!token) {
      setError('Faculty session expired. Please log in again.')
      setLoading(false)
      return
    }

    const subjectId = parseInt(selectedSubject, 10)
    const parsedMax = parseFloat(maxMarks)

    if (Number.isNaN(subjectId) || subjectId <= 0) {
      setError('Select a valid subject before submitting marks.')
      setLoading(false)
      return
    }

    if (!Number.isFinite(parsedMax) || parsedMax <= 0) {
      setError('Enter a valid positive number for max marks.')
      setLoading(false)
      return
    }

    const marksRecords = students.map((student) => {
      const rawValue = marks[student.id]?.marks_obtained
      const numeric = rawValue !== undefined && rawValue !== '' ? parseFloat(rawValue) : 0
      return {
        student_id: student.id,
        marks_obtained: Number.isFinite(numeric) ? numeric : 0,
        remarks: marks[student.id]?.remarks || ''
      }
    })

    try {
      await axios.post(
        API_ENDPOINTS.FACULTY_MARKS_BULK,
        {
          subject_id: subjectId,
          exam_type: examType,
          max_marks: parsedMax,
          marks_records: marksRecords
        },
        {
          headers: {
            ...authHeaders,
            'Content-Type': 'application/json'
          }
        }
      )

      alert('Marks added successfully!')
    } catch (err) {
      console.error('Submit marks error:', err)
      setError(err.response?.data?.message || 'Failed to submit marks. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const calculatePercentage = (value) => {
    const obtained = parseFloat(value)
    const total = parseFloat(maxMarks)

    if (!Number.isFinite(obtained) || !Number.isFinite(total) || total <= 0) {
      return 0
    }

    return (obtained / total) * 100
  }

  const getGrade = (percentage) => {
    if (!Number.isFinite(percentage)) return 'F'
    if (percentage >= 90) return 'A+'
    if (percentage >= 80) return 'A'
    if (percentage >= 70) return 'B+'
    if (percentage >= 60) return 'B'
    if (percentage >= 50) return 'C'
    if (percentage >= 40) return 'D'
    return 'F'
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <FacultyNavbar />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Enter Marks</h2>
          </div>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                disabled={subjectLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">
                  {subjectLoading
                    ? 'Loading subjects...'
                    : subjects.length === 0
                      ? 'No subjects assigned'
                      : 'Select Subject'}
                </option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.subject_code} - {subject.subject_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type *</label>
              <select
                value={examType}
                onChange={(e) => setExamType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {examTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Marks *</label>
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

        {selectedSubject && (
          <>
            {studentsLoading && (
              <div className="mb-6 bg-white rounded-lg shadow-md p-6 text-center text-sm text-gray-600">
                Loading students...
              </div>
            )}

            {!studentsLoading && students.length > 0 && (
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
                        const percentage = calculatePercentage(marks[student.id]?.marks_obtained)
                        const grade = getGrade(percentage)

                        return (
                          <tr key={student.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {student.usn}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {student.full_name || student.name || 'Student'}
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
                              {percentage.toFixed(2)}%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-bold ${
                                  grade === 'F'
                                    ? 'bg-red-100 text-red-800'
                                    : grade.includes('A')
                                      ? 'bg-green-100 text-green-800'
                                      : grade.includes('B')
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
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
                        )
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

            {!studentsLoading && students.length === 0 && (
              <div className="bg-white rounded-lg shadow-md p-12 text-center text-gray-500">
                No students are available for this subject.
              </div>
            )}
          </>
        )}

        {!selectedSubject && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500">Select a subject to start entering marks</p>
          </div>
        )}
        </div>
      </div>
    </div>
  )
}

export default MarksEntry
