import React from 'react';
import PropTypes from 'prop-types';

const ScheduleView = ({ scheduleData, classes, subjects, users, onTeacherClick }) => {
  const periods = [1, 2, 3, 4, 5, 6]; // Assuming fixed periods 1 to 6

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6 space-y-4">
        {periods.map((period) => {
          const assignment = scheduleData.find((s) => s.period === period);
          if (assignment) {
            const cls = classes.find((c) => c.id === assignment.classId);
            const subject = subjects.find((s) => s.id === assignment.subjectId);
            const teacher = users.find((u) => u.id === assignment.teacherId);

            return (
              <div
                key={period}
                className="p-4 border rounded-lg flex items-center justify-between bg-teal-50 border-teal-200"
              >
                <div className="font-semibold text-slate-600">Period {period}</div>
                <div>
                  <p className="font-bold text-lg text-right">{subject?.name || 'N/A'}</p>
                  <p className="text-sm text-slate-600 text-right">{cls?.name || 'N/A'}</p>
                  {teacher && (
                    <button
                      onClick={() => onTeacherClick(teacher.id)}
                      className="text-sm text-slate-500 text-right hover:text-teal-600"
                    >
                      Teacher: {teacher.name}
                    </button>
                  )}
                </div>
              </div>
            );
          } else {
            return (
              <div
                key={period}
                className="p-4 border rounded-lg flex items-center justify-between bg-stone-50 border-dashed"
              >
                <div className="font-semibold text-slate-400">Period {period}</div>
                <p className="text-sm text-slate-400">Free Period</p>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

ScheduleView.propTypes = {
  scheduleData: PropTypes.array.isRequired, // Filtered schedule specific to the user/class
  classes: PropTypes.array.isRequired,
  subjects: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
  onTeacherClick: PropTypes.func, // Optional callback for clicking on teacher name
};

ScheduleView.defaultProps = {
  onTeacherClick: () => {}, // Provide a default empty function
};

export default ScheduleView;