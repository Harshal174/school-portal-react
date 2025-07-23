import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const AttendanceGrid = ({
  data, // This will be mockData.attendance or mockData.teacherAttendance
  users, // mockData.users (for names)
  classes, // mockData.classes (for class names, if student attendance)
  students, // mockData.students (for student names, if student attendance)
  reportType, // 'student' or 'teacher'
  classId, // Optional, for student attendance grid
  onBack, // Function to navigate back to report selection
}) => {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
    'October', 'November', 'December',
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const headers = Array.from({ length: daysInMonth }, (_, i) => String(i + 1).padStart(2, '0'));

  const filteredData = data.filter(item => {
    const itemDate = new Date(item.date);
    return itemDate.getMonth() === month && itemDate.getFullYear() === year;
  });

  const getRowData = (entityId) => {
    const row = {};
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      let dailyStatus = '';
      let colorClass = 'bg-slate-200';

      if (reportType === 'student') {
        const studentRecords = filteredData.filter(
          (a) => a.studentId === entityId && a.date === dateString
        );
        if (studentRecords.length > 0) {
          if (studentRecords.some((r) => r.status === 'Absent')) {
            dailyStatus = 'A';
            colorClass = 'bg-red-500';
          } else if (studentRecords.some((r) => r.status === 'Late')) {
            dailyStatus = 'L';
            colorClass = 'bg-amber-500';
          } else {
            dailyStatus = 'P';
            colorClass = 'bg-green-500';
          }
        }
      } else { // teacher reportType
        const teacherRecord = filteredData.find(
          (a) => a.teacherId === entityId && a.date === dateString
        );
        if (teacherRecord) {
          dailyStatus = teacherRecord.status.charAt(0);
          if (teacherRecord.status === 'Present') {
            colorClass = 'bg-green-500';
          } else if (teacherRecord.status === 'On Leave') {
            colorClass = 'bg-red-500';
          }
        }
      }
      row[day] = { status: dailyStatus, colorClass };
    }
    return row;
  };

  let entities = [];
  let title = '';
  if (reportType === 'student' && classId) {
    const selectedClass = classes.find(c => c.id === classId);
    title = `Monthly Report: ${selectedClass?.name || 'Unknown Class'}`;
    entities = students[classId] || [];
  } else if (reportType === 'teacher') {
    title = 'Monthly Teacher Attendance';
    entities = users.filter(u => u.role === 'teacher');
  }

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    const csvHeaders = [(reportType === 'student' ? 'Student Name' : 'Teacher Name'), ...headers];
    csvContent += csvHeaders.join(",") + "\r\n";

    entities.forEach(entity => {
      const rowData = getRowData(entity.id);
      const row = [entity.name];
      for (let day = 1; day <= daysInMonth; day++) {
        row.push(rowData[day].status);
      }
      csvContent += row.join(",") + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${reportType}_attendance_${year}_${month + 1}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <button onClick={onBack} className="text-teal-600 mb-4 font-semibold">&larr; Back to Report Selection</button>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <div className="flex gap-2 items-center mt-2">
            <select
              id="monthSelector"
              className="p-2 border rounded-lg"
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value))}
            >
              {monthNames.map((m, i) => (
                <option key={i} value={i}>
                  {m}
                </option>
              ))}
            </select>
            <select
              id="yearSelector"
              className="p-2 border rounded-lg"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
            >
              <option>2025</option>
              <option>2024</option>
              {/* Add more years as needed */}
            </select>
          </div>
        </div>
        <button onClick={handleExportCSV} className="bg-teal-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-teal-700">
          Export to CSV
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-slate-100">
            <tr>
              <th className="p-2 border font-semibold sticky left-0 bg-slate-100">
                {reportType === 'student' ? 'Student' : 'Teacher'}
              </th>
              {headers.map((day) => (
                <th key={day} className="p-2 border text-center text-sm">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {entities.length > 0 ? (
              entities.map((entity) => {
                const rowData = getRowData(entity.id);
                return (
                  <tr key={entity.id} className="border-b last:border-b-0">
                    <td className="p-2 border font-semibold sticky left-0 bg-white">{entity.name}</td>
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
                      <td key={day} className="p-2 border text-center">
                        <span
                          className={`w-6 h-6 flex items-center justify-center rounded-full text-white text-xs font-bold ${rowData[day].colorClass}`}
                        >
                          {rowData[day].status}
                        </span>
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={daysInMonth + 1} className="p-4 text-center text-slate-500">
                  No {reportType} records found for this period.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

AttendanceGrid.propTypes = {
  data: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
  classes: PropTypes.array.isRequired,
  students: PropTypes.object.isRequired, // students object with classId as keys
  reportType: PropTypes.oneOf(['student', 'teacher']).isRequired,
  classId: PropTypes.string, // Required for student reports
  onBack: PropTypes.func.isRequired,
};

export default AttendanceGrid;