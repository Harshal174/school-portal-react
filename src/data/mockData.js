// src/data/mockData.js

const mockData = {
    users: [
        { id: 1, teacherId: 'TCH1001', name: 'Priya Sharma', email: 'teacher@school.com', password: 'password', role: 'teacher', status: 'active', passwordChanged: true, qualifications: 'M.A. in English Literature', profilePicUrl: 'https://placehold.co/128x128/e9d5ff/4c1d95?text=PS' },
        { id: 2, name: 'Raj Singh (Principal)', email: 'admin@school.com', password: 'password', role: 'admin', status: 'active', passwordChanged: true },
        { id: 3, teacherId: 'TCH1002', name: 'Anjali Gupta', email: 'teacher2@school.com', password: 'password', role: 'teacher', status: 'active', passwordChanged: true, qualifications: 'M.Sc. in Physics', profilePicUrl: 'https://placehold.co/128x128/c7d2fe/312e81?text=AG' },
        { id: 4, teacherId: 'TCH1003', name: 'Vikram Rathore', email: 'teacher3@school.com', password: 'password', role: 'teacher', status: 'active', passwordChanged: true, qualifications: 'B.Ed, M.A. in History', profilePicUrl: 'https://placehold.co/128x128/bbf7d0/14532d?text=VR' },
        { id: 5, teacherId: 'TCH1004', name: 'Sunita Menon', email: 'teacher4@school.com', password: 'password', role: 'teacher', status: 'active', passwordChanged: true, qualifications: 'M.Sc. in Chemistry', profilePicUrl: 'https://placehold.co/128x128/fecaca/7f1d1d?text=SM' },
        { id: 6, teacherId: 'TCH1005', name: 'Ravi Kumar', email: 'teacher5@school.com', password: 'password', role: 'teacher', status: 'active', passwordChanged: true, qualifications: 'MCA', profilePicUrl: 'https://placehold.co/128x128/a5f3fc/0e7490?text=RK' },
        { id: 7, teacherId: 'TCH1006', name: 'Meera Desai', email: 'teacher6@school.com', password: 'password', role: 'teacher', status: 'active', passwordChanged: true, qualifications: 'M.A. in Hindi', profilePicUrl: 'https://placehold.co/128x128/fed7aa/854d0e?text=MD' },
        { id: 8, teacherId: 'TCH1007', name: 'Sanjay Joshi', email: 'teacher7@school.com', password: 'password', role: 'teacher', status: 'active', passwordChanged: true, qualifications: 'M.Sc. in Mathematics', profilePicUrl: 'https://placehold.co/128x128/d1d5db/1f2937?text=SJ' },
        { id: 9, teacherId: 'TCH1008', name: 'Kavita Iyer', email: 'teacher8@school.com', password: 'password', role: 'teacher', status: 'active', passwordChanged: true, qualifications: 'B.P.Ed (Physical Education)', profilePicUrl: 'https://placehold.co/128x128/fbcfe8/86198f?text=KI' },
    ],
    students: {}, // Will be populated dynamically
    classes: [
        { id: 'C1', name: 'Grade 1 - Section A', teacherId: null },
        { id: 'C2', name: 'Grade 2 - Section A', teacherId: null },
        { id: 'C3', name: 'Grade 3 - Section A', teacherId: null },
        { id: 'C4', name: 'Grade 4 - Section A', teacherId: null },
        { id: 'C5', name: 'Grade 5 - Section A', teacherId: null },
        { id: 'C6', name: 'Grade 6 - Section A', teacherId: null },
        { id: 'C7', name: 'Grade 7 - Section A', teacherId: null },
        { id: 'C8', name: 'Grade 8 - Section A', teacherId: null },
    ],
    subjects: [
        { id: 'S1', name: 'English' }, { id: 'S2', name: 'Hindi' }, { id: 'S3', name: 'Mathematics' },
        { id: 'S4', name: 'Science' }, { id: 'S5', name: 'Social Studies' }, { id: 'S6', name: 'Computer Science' },
        { id: 'S7', name: 'Art & Craft' }, { id: 'S8', name: 'Physical Education' }
    ],
    schedule: [], // Populated dynamically
    attendance: [], // Populated dynamically
    teacherAttendance: [],
    leaves: [
        { id: 1, teacherId: 3, teacherName: 'Anjali Gupta', startDate: '2025-07-25', endDate: '2025-07-26', reason: 'Family function', status: 'Pending' },
        { id: 2, teacherId: 1, teacherName: 'Priya Sharma', startDate: '2025-07-21', endDate: '2025-07-21', reason: 'Medical appointment', status: 'Approved' },
    ],
    announcements: [
        { id: 1, date: '2025-07-22', title: 'Annual Sports Day', content: 'The Annual Sports Day will be held next Friday. All students are requested to participate.'},
        { id: 2, date: '2025-07-20', title: 'Parent-Teacher Meeting', content: 'The quarterly Parent-Teacher Meeting is scheduled for this Saturday. Please book your slots.'}
    ],
    exams: [
        { id: 1, name: 'Unit Test 1', date: '2025-05-15', maxMarks: 25 },
        { id: 2, name: 'Mid-Term Examination', date: '2025-09-20', maxMarks: 100 }
    ],
    marks: [],
};

// --- DYNAMIC DATA GENERATION ---
function generateMockData() {
    const studentNames = [
        "Aarav Sharma", "Vivaan Singh", "Aditya Kumar", "Vihaan Gupta", "Arjun Patel", "Sai Reddy", "Reyansh Mishra", "Krishna Verma", "Ishaan Yadav", "Rohan Prasad", "Aanya Joshi", "Diya Mehra", "Saanvi Agarwal", "Myra Khanna", "Anika Nair", "Kiara Iyer", "Zara Khan", "Pari Shah", "Advika Menon", "Ishita Rao", "Kabir Das", "Aryan Chaudhary", "Dhruv Jain", "Zayn Ali", "Ayaan Kumar", "Kian Sharma", "Shaurya Singh", "Atharv Gupta", "Dev Patel", "Neel Reddy", "Anvi Mishra", "Siya Verma", "Aadhya Yadav", "Navya Prasad", "Riya Joshi", "Prisha Mehra", "Anaya Agarwal", "Yashvi Khanna", "Amaira Nair", "Miraya Iyer", "Laksh Kumar", "Veer Singh", "Abir Gupta", "Yuvan Patel", "Samarth Reddy", "Aarush Mishra", "Rudra Verma", "Om Yadav", "Parth Prasad", "Jai Joshi", "Shanaya Mehra", "Aarohi Agarwal", "Amara Khanna", "Eva Nair", "Inaya Iyer", "Sia Khan", "Tara Shah", "Avni Menon", "Zoya Rao", "Aisha Das", "Arnav Chaudhary", "Advik Jain", "Aadi Ali", "Arin Kumar", "Vivaan Sharma", "Yash Singh", "Ved Gupta", "Zain Patel", "Manan Reddy", "Arham Mishra", "Ahaana Verma", "Akshara Yadav", "Alia Prasad", "Amrita Joshi", "Anisha Mehra", "Asmi Agarwal", "Avani Khanna", "Bhavya Nair", "Charvi Iyer", "Darshini Khan", "Daksh Shah", "Divit Menon", "Ehan Rao", "Ekansh Das", "Gaurav Chaudhary", "Harsh Jain", "Hridhaan Ali", "Ivaan Kumar", "Jivin Sharma", "Krish Singh", "Ira Gupta", "Jiya Patel", "Kashvi Reddy", "Keya Mishra", "Kimaya Verma", "Larisa Yadav", "Mahi Prasad", "Mishka Joshi", "Naisha Mehra", "Navi Agarwal", "Nirvaan Khanna", "Ojas Nair", "Pahal Iyer", "Parv Khan", "Pranay Shah", "Ranbir Menon", "Rehan Rao", "Ritvik Das", "Rishaan Chaudhary", "Samar Jain", "Nitara Ali", "Oviya Kumar", "Piya Sharma", "Pranavi Singh", "Radha Gupta", "Rhea Patel", "Saira Reddy", "Samaira Mishra", "Sanvi Verma", "Shreya Yadav", "Soham Prasad", "Tanish Joshi", "Tejas Mehra", "Uthkarsh Agarwal", "Vansh Khanna", "Vidit Nair", "Viraj Iyer", "Yug Khan", "Aarav Shah", "Vivaan Menon", "Tisha Rao", "Urvi Das", "Vanya Chaudhary", "Vedika Jain", "Yashika Ali", "Zara Kumar", "Aaditri Sharma", "Aahana Singh", "Aaradhya Gupta", "Aarvi Patel", "Adah Reddy", "Adira Mishra", "Advaita Verma", "Ahana Yadav", "Alisha Prasad", "Amoli Joshi", "Anvi Mehra", "Anya Agarwal", "Asmi Khanna", "Avni Nair", "Ayush Iyer", "Bhargav Khan", "Chirag Shah", "Darsh Menon", "Deepak Rao", "Devansh Das", "Dhairya Chaudhary", "Divyansh Jain", "Gagan Ali", "Gautam Kumar", "Bhavna Sharma", "Charul Singh", "Daksha Gupta", "Deepa Patel", "Devaki Reddy", "Dhriti Mishra", "Divya Verma", "Eesha Yadav", "Eila Prasad", "Falak Joshi", "Girik Mehra", "Harshil Agarwal", "Hemant Khanna", "Hitesh Nair", "Indra Iyer", "Ishank Khan", "Jagat Shah", "Jay Menon", "Jignesh Rao", "Kairav Das", "Gargi Chaudhary", "Geeta Jain", "Gitanjali Ali", "Hamsa Kumar", "Harinakshi Sharma", "Heer Singh", "Hetal Gupta", "Indira Patel", "Ipsita Reddy", "Ishani Mishra", "Kanan Verma", "Karan Yadav", "Kartik Prasad", "Kushal Joshi", "Lalit Mehra", "Madhav Agarwal", "Manish Khanna", "Mayank Nair", "Mohit Iyer", "Naman Khan", "Jahnavi Shah", "Janaki Menon", "Jeevika Rao", "Kajal Das", "Kalpana Chaudhary", "Kamala Jain", "Kanak Ali", "Kanti Kumar", "Karishma Sharma", "Kavita Singh", "Nakul Gupta", "Naveen Patel", "Nihal Reddy", "Nikhil Mishra", "Nishant Verma", "Nitin Yadav", "Omprakash Prasad", "Pankaj Joshi", "Piyush Mehra", "Pranav Agarwal", "Lata Gupta", "Lavanya Patel", "Leela Reddy", "Madhu Mishra", "Malini Verma", "Manju Yadav", "Maya Prasad", "Meena Joshi", "Meera Mehra", "Mohini Agarwal", "Prateek Khanna", "Raghav Nair", "Rajat Iyer", "Rakesh Khan", "Ravi Shah", "Rishi Menon", "Rohit Rao", "Sachin Das", "Sahil Chaudhary", "Sameer Jain", "Nalini Khanna", "Nandini Nair", "Neelam Iyer", "Neha Khan", "Nidhi Shah", "Nilima Menon", "Nirmala Rao", "Nisha Das", "Nita Chaudhary", "Pallavi Jain", "Sanjay Ali", "Sarthak Kumar", "Saurabh Sharma", "Shaurya Singh", "Shiva Gupta", "Siddharth Patel", "Sumit Reddy", "Sunil Mishra", "Suresh Verma", "Tanmay Yadav", "Pooja Ali", "Poonam Kumar", "Prabha Sharma", "Pratima Singh", "Preeti Gupta", "Priya Patel", "Radhika Reddy", "Rajani Mishra", "Rani Verma", "Rashmi Yadav", "Tushar Prasad", "Uday Joshi", "Varun Mehra", "Vikas Agarwal", "Vinay Khanna", "Vishal Nair", "Vivek Iyer", "Yash Khan", "Yogesh Shah", "Zubin Menon", "Rekha Prasad", "Renu Joshi", "Ritika Mehra", "Ritu Agarwal", "Rohini Khanna", "Roshni Nair", "Rupa Iyer", "Sabita Khan", "Sadhana Shah", "Sandhya Menon", "Sangeeta Rao", "Sarika Das", "Sarita Chaudhary", "Savita Jain", "Seema Ali", "Shaila Kumar", "Shalini Sharma", "Shanti Singh", "Sharda Gupta", "Sharmila Patel"
    ];

    let studentIdCounter = 1001;
    mockData.classes.forEach(cls => {
        mockData.students[cls.id] = [];
        const studentCount = 40 + Math.floor(Math.random() * 11);
        for (let i = 0; i < studentCount; i++) {
            const randomNameIndex = Math.floor(Math.random() * studentNames.length);
            const randomName = studentNames.splice(randomNameIndex, 1)[0] || `Student ${studentIdCounter}`;
            const year = 2015 - parseInt(cls.id.substring(1));
            const dob = `${year}-${String(Math.floor(Math.random()*12)+1).padStart(2,'0')}-${String(Math.floor(Math.random()*28)+1).padStart(2,'0')}`;
            mockData.students[cls.id].push({
                id: studentIdCounter,
                studentId: String(Math.floor(1000000000 + Math.random() * 9000000000)),
                name: randomName,
                dob: dob,
                classId: cls.id,
                profilePicUrl: `https://placehold.co/128x128/0d9488/ffffff?text=${randomName.charAt(0)}`
            });
            studentIdCounter++;
        }
    });

    const firstStudent = mockData.students['C1'][0];
    mockData.users.push({
        id: firstStudent.id, name: firstStudent.name, email: firstStudent.studentId, password: firstStudent.dob, role: 'student', status: 'active', passwordChanged: true, studentId: firstStudent.id
    });


    const defaultScheduleSubjects = ['S3', 'S1', 'S4', 'S2', 'S5', 'S8']; // Math, English, Science, Hindi, Social, PE
    mockData.classes.forEach(cls => {
        for (let i = 0; i < 6; i++) {
            mockData.schedule.push({
                classId: cls.id,
                period: i + 1,
                subjectId: defaultScheduleSubjects[i],
                teacherId: null
            });
        }
    });

    const teachers = mockData.users.filter(u => u.role === 'teacher' && u.status === 'active');
    let teacherIndex = 0;
    for (let period = 1; period <= 6; period++) {
        for (let c = 0; c < mockData.classes.length; c++) {
            const classId = mockData.classes[c].id;
            const slot = mockData.schedule.find(s => s.classId === classId && s.period === period);

            let assigned = false;
            for (let i = 0; i < teachers.length; i++) {
                const teacher = teachers[teacherIndex % teachers.length];
                teacherIndex++;

                const isBusy = mockData.schedule.some(s => s.period === period && s.teacherId === teacher.id);
                const totalLoad = mockData.schedule.filter(s => s.teacherId === teacher.id).length;

                if (!isBusy && totalLoad < 6) {
                    slot.teacherId = teacher.id;
                    assigned = true;
                    break;
                }
            }
        }
    }

    const availableTeachers = [...teachers];
    mockData.classes.forEach(cls => {
        if (availableTeachers.length > 0) {
            cls.teacherId = availableTeachers.shift().id;
        }
    });

    const today = new Date();
    for (let i = 0; i < 365; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dayOfWeek = date.getDay();

        if (dayOfWeek === 0 || dayOfWeek === 6) continue; // Skip weekends

        const dateString = date.toISOString().split('T')[0];

        mockData.classes.forEach(cls => {
            mockData.students[cls.id].forEach(student => {
                for (let period = 1; period <= 6; period++) {
                    const rand = Math.random();
                    let status = 'Present';
                    if (rand > 0.95) status = 'Absent';
                    else if (rand > 0.9) status = 'Late';
                    mockData.attendance.push({ date: dateString, classId: cls.id, period, studentId: student.id, status });
                }
            });
        });

        teachers.forEach(teacher => {
            const rand = Math.random();
            let status = 'Present';
            if(rand > 0.98) status = 'On Leave';
            mockData.teacherAttendance.push({ teacherId: teacher.id, date: dateString, status });
        });
    }

    mockData.exams.forEach(exam => {
        mockData.classes.forEach(cls => {
            mockData.students[cls.id].forEach(student => {
                mockData.subjects.forEach(subject => {
                    const marksObtained = Math.floor(exam.maxMarks * (0.4 + Math.random() * 0.6));
                    mockData.marks.push({
                        id: Date.now() + student.id + subject.id + exam.id, // Unique ID
                        studentId: student.id,
                        classId: cls.id,
                        subjectId: subject.id,
                        examId: exam.id,
                        marksObtained: marksObtained
                    });
                });
            });
        });
    });
}

// Call the generation function once when the module is loaded
generateMockData();

// Export the mockData object
export { mockData };