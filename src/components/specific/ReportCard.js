import React from 'react';
import PropTypes from 'prop-types';

const ReportCard = ({ student, studentClass, exams, subjects, marks, onBack }) => {
  if (!student) {
    return <p>Student data not available.</p>;
  }

  const studentMarks = marks.filter((m) => m.studentId === student.id);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg max-w-4xl mx-auto">
      <button onClick={onBack} className="text-teal-600 mb-4 font-semibold">
        &larr; Back to {studentClass?.name || 'Class'}
      </button>

      {/* Student Header */}
      <div className="flex items-center gap-6 pb-6 border-b">
        <img
          src={student.profilePicUrl}
          alt="Profile Picture"
          className="w-24 h-24 rounded-full border-4 border-teal-200"
        />
        <div>
          <h1 className="text-3xl font-bold">{student.name}</h1>
          <p className="text-slate-500">
            Student ID: {student.studentId} | Class: {studentClass?.name || 'N/A'}
          </p>
        </div>
      </div>

      {/* Detailed Marks */}
      <div className="mt-8">
        <h3 className="font-bold text-lg mb-4">Subject-wise Marks</h3>
        <div className="space-y-4">
          {exams.map((exam) => {
            const examMarks = studentMarks.filter((m) => m.examId === exam.id);
            let totalMarksObtained = 0;
            let maxTotalMarksForExam = 0;

            const marksRows = examMarks.map((mark) => {
              const subject = subjects.find((s) => s.id === mark.subjectId);
              totalMarksObtained += mark.marksObtained;
              maxTotalMarksForExam += exam.maxMarks;
              return (
                <tr key={`${mark.id}-${mark.subjectId}`} className="border-b">
                  <td className="p-3">{subject?.name || 'N/A'}</td>
                  <td className="p-3 text-center">{exam.maxMarks}</td>
                  <td className="p-3 text-center">{mark.marksObtained}</td>
                </tr>
              );
            });

            const percentage =
              maxTotalMarksForExam > 0
                ? ((totalMarksObtained / maxTotalMarksForExam) * 100).toFixed(2)
                : 0;

            return (
              <div key={exam.id} className="border rounded-lg">
                <p className="p-3 bg-stone-100 font-semibold border-b">
                  {exam.name}
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-stone-50">
                      <tr>
                        <th className="p-3 font-semibold">Subject</th>
                        <th className="p-3 font-semibold text-center">Max Marks</th>
                        <th className="p-3 font-semibold text-center">Marks Obtained</th>
                      </tr>
                    </thead>
                    <tbody>{marksRows}</tbody>
                    <tfoot className="font-bold bg-stone-100">
                      <tr>
                        <td className="p-3">Total</td>
                        <td className="p-3 text-center">{maxTotalMarksForExam}</td>
                        <td className="p-3 text-center">{totalMarksObtained}</td>
                      </tr>
                      <tr>
                        <td className="p-3" colSpan="2">
                          Percentage
                        </td>
                        <td className="p-3 text-center text-teal-600">
                          {percentage}%
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            );
          })}
          {studentMarks.length === 0 && (
            <p className="text-slate-500 text-center py-8">No marks found for this student.</p>
          )}
        </div>
      </div>
    </div>
  );
};

ReportCard.propTypes = {
  student: PropTypes.object.isRequired,
  studentClass: PropTypes.object,
  exams: PropTypes.array.isRequired,
  subjects: PropTypes.array.isRequired,
  marks: PropTypes.array.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default ReportCard;