/*
 * NotebookXL deterministic demo data
 *
 * This file deliberately has no runtime dependencies.  It can be loaded with a
 * plain <script> tag or required from Node/CommonJS.  The generated data is
 * synthetic, stable between page loads, and tenant-scoped throughout.
 */
(function attachNotebookXLSeed(globalScope) {
  'use strict';

  var CURRENT_ACADEMIC_YEAR = '2026-27';
  var CURRENT_ACADEMIC_YEAR_LABEL = '2026–27';
  var DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  var PERIODS = [
    { number: 1, start: '08:30', end: '09:10' },
    { number: 2, start: '09:15', end: '09:55' },
    { number: 3, start: '10:10', end: '10:50' },
    { number: 4, start: '11:10', end: '11:50' },
    { number: 5, start: '11:55', end: '12:35' },
    { number: 6, start: '13:15', end: '13:55' },
    { number: 7, start: '14:00', end: '14:40' }
  ];
  var SECTIONS = ['A', 'B', 'C'];
  var ROLES = [
    'SUPER_ADMIN',
    'SCHOOL_ADMIN',
    'PRINCIPAL',
    'ACADEMIC_COORDINATOR',
    'TEACHER',
    'STUDENT'
  ];

  /* Subjects are data records, not a UI-level enum.  Each tenant receives its
   * own cloned records, so later changes to one tenant cannot affect another. */
  var SUBJECT_CATALOGUE = [
    { key: 'mathematics', name: 'Mathematics', code: 'MAT', grades: range(1, 10), department: 'Mathematics' },
    { key: 'english', name: 'English', code: 'ENG', grades: range(1, 10), department: 'Languages' },
    { key: 'telugu', name: 'Telugu', code: 'TEL', grades: range(1, 10), department: 'Languages' },
    { key: 'hindi', name: 'Hindi', code: 'HIN', grades: range(1, 10), department: 'Languages' },
    { key: 'urdu', name: 'Urdu', code: 'URD', grades: range(1, 10), department: 'Languages' },
    { key: 'environmental-science', name: 'Environmental Science', code: 'EVS', grades: range(1, 5), department: 'Science' },
    { key: 'science', name: 'Science', code: 'SCI', grades: range(6, 10), department: 'Science' },
    { key: 'social-science', name: 'Social Science', code: 'SST', grades: range(3, 10), department: 'Social Science' },
    { key: 'physics', name: 'Physics', code: 'PHY', grades: range(8, 10), department: 'Science' },
    { key: 'computer-science', name: 'Computer Science', code: 'CSC', grades: range(3, 10), department: 'Technology' },
    { key: 'general-knowledge', name: 'General Knowledge', code: 'GK', grades: range(1, 8), department: 'Humanities' },
    { key: 'art', name: 'Art', code: 'ART', grades: range(1, 10), department: 'Creative Arts' },
    { key: 'physical-education', name: 'Physical Education', code: 'PE', grades: range(1, 10), department: 'Sports' }
  ];

  var TEACHING_SPECIALTIES = [
    ['mathematics'],
    ['mathematics', 'physics'],
    ['mathematics', 'computer-science'],
    ['english', 'social-science'],
    ['english', 'general-knowledge'],
    ['telugu'],
    ['telugu', 'hindi'],
    ['hindi'],
    ['urdu'],
    ['urdu', 'english'],
    ['environmental-science', 'science'],
    ['environmental-science', 'science'],
    ['science', 'physics'],
    ['social-science'],
    ['social-science', 'general-knowledge'],
    ['computer-science'],
    ['art', 'general-knowledge'],
    ['physical-education', 'art'],
    ['mathematics', 'english', 'environmental-science'],
    ['telugu', 'hindi', 'urdu', 'general-knowledge']
  ];

  /* Total intentionally varies by teacher (546 records per school), while
   * remaining below the 35 available weekly slots for an individual teacher. */
  var WEEKLY_PERIOD_TARGETS = [
    31, 29, 30, 27, 28, 24, 26, 25, 27, 26,
    31, 29, 32, 25, 28, 24, 22, 23, 31, 28
  ];

  var TENANT_BLUEPRINTS = [
    {
      id: 'tenant-iams-school',
      slug: 'iams',
      code: 'IAMS',
      seed: 148903,
      schoolName: 'IAMS (ISRAR AHMED MISSION SCHOOL)',
      shortName: 'IAMS School',
      address: 'Indiranagar, Rajendranagar, Hyderabad - 500052, Telangana, India',
      primaryColor: '#1e3a8a',
      accentColor: '#d97706',
      teachers: [
        ['Farah', 'Siddiqui', 'Female'], ['Mohammed', 'Ismail', 'Male'],
        ['Ayesha', 'Qureshi', 'Female'], ['Syed', 'Faisal', 'Male'],
        ['Zahra', 'Patel', 'Female'], ['Raghav', 'Reddy', 'Male'],
        ['Meher', 'Fatima', 'Female'], ['Arvind', 'Sharma', 'Male'],
        ['Kavya', 'Naidu', 'Female'], ['Mohammed', 'Yousuf', 'Male'],
        ['Saba', 'Banu', 'Female'], ['Vikram', 'Iyer', 'Male'],
        ['Nandini', 'Goud', 'Female'], ['Imran', 'Hussain', 'Male'],
        ['Deepika', 'Nair', 'Female'], ['Rahul', 'Verma', 'Male'],
        ['Hiba', 'Ali', 'Female'], ['Karthik', 'Dhanraj', 'Male'],
        ['Priya', 'Jain', 'Female'], ['Adeel', 'Khan', 'Male']
      ],
      boyNames: [
        'Aarav', 'Ayaan', 'Abdul', 'Aditya', 'Ahmed', 'Akshay', 'Arjun', 'Armaan',
        'Danish', 'Faizan', 'Harish', 'Ibrahim', 'Ishaan', 'Karthik', 'Mohammed', 'Mustafa',
        'Naveen', 'Pranav', 'Rahul', 'Rehan', 'Ritvik', 'Rohan', 'Sai', 'Sameer',
        'Shaurya', 'Siddharth', 'Srinivas', 'Syed', 'Vihaan', 'Vivek', 'Yash', 'Zayan'
      ],
      girlNames: [
        'Aafreen', 'Aaliya', 'Amina', 'Ananya', 'Anushka', 'Arpita', 'Bhavya', 'Divya',
        'Farheen', 'Fatima', 'Haniya', 'Hiba', 'Ira', 'Ishita', 'Jahnavi', 'Keerthana',
        'Mahira', 'Mariam', 'Mehak', 'Mounika', 'Nida', 'Pallavi', 'Riya', 'Saanvi',
        'Sadia', 'Sana', 'Sara', 'Shreya', 'Sravya', 'Suhana', 'Swathi', 'Zoya'
      ],
      surnames: [
        'Khan', 'Reddy', 'Shaik', 'Sharma', 'Rao', 'Qureshi', 'Naidu', 'Begum',
        'Patel', 'Hussain', 'Gupta', 'Siddiqui', 'Goud', 'Ali', 'Verma', 'Basha',
        'Nair', 'Yadav', 'Iyer', 'Jain', 'Chowdhary', 'Rani', 'Das', 'Kapoor',
        'Joshi', 'Rizvi', 'Mishra', 'Babu', 'Sayeed', 'Dhanraj', 'Ahmed', 'Mirza'
      ]
    },
    {
      id: 'tenant-iqra-international',
      slug: 'iqrainternational',
      code: 'IIS',
      seed: 962771,
      schoolName: 'Iqra International School',
      shortName: 'Iqra International',
      address: 'Madinaguda, Hyderabad, Telangana, India',
      primaryColor: '#08756c',
      accentColor: '#d99a39',
      teachers: [
        ['Sana', 'Mirza', 'Female'], ['Venkatesh', 'Kumar', 'Male'],
        ['Niharika', 'Pillai', 'Female'], ['Feroz', 'Baig', 'Male'],
        ['Pooja', 'Agarwal', 'Female'], ['Ramesh', 'Goud', 'Male'],
        ['Saniya', 'Parveen', 'Female'], ['Manoj', 'Chary', 'Male'],
        ['Nusrat', 'Sultana', 'Female'], ['Naveen', 'Konda', 'Male'],
        ['Shabnam', 'Firdous', 'Female'], ['Ravi', 'Teja', 'Male'],
        ['Sreelatha', 'Madduri', 'Female'], ['Tariq', 'Ansari', 'Male'],
        ['Aparna', 'Mitra', 'Female'], ['Girish', 'Menon', 'Male'],
        ['Fathima', 'Noor', 'Female'], ['Prakash', 'Babu', 'Male'],
        ['Gayathri', 'Prasad', 'Female'], ['Arif', 'Mahmood', 'Male']
      ],
      boyNames: [
        'Aarush', 'Abeer', 'Akhil', 'Altaf', 'Anirudh', 'Arham', 'Bharat', 'Charan',
        'Darshan', 'Eshan', 'Fahad', 'Gautam', 'Hamza', 'Jayant', 'Krishna', 'Manav',
        'Nihal', 'Omkar', 'Parth', 'Qasim', 'Rayan', 'Ritesh', 'Samar', 'Tanmay',
        'Uday', 'Varun', 'Wasim', 'Yuvraj', 'Zaheer', 'Zubair', 'Aariz', 'Basil'
      ],
      girlNames: [
        'Aaradhya', 'Aditi', 'Afsha', 'Anjali', 'Asmita', 'Barkha', 'Chandni', 'Disha',
        'Esha', 'Fariha', 'Gargi', 'Hafsa', 'Inaya', 'Jasmin', 'Kiranmayi', 'Lahari',
        'Madiha', 'Navya', 'Oviya', 'Pari', 'Ruhani', 'Samaira', 'Tara', 'Uma',
        'Vidhi', 'Waniya', 'Yamini', 'Zainab', 'Apoorva', 'Bhumika', 'Chitra', 'Dua'
      ],
      surnames: [
        'Mirza', 'Kumar', 'Pillai', 'Baig', 'Agarwal', 'Konda', 'Parveen', 'Chary',
        'Sultana', 'Reddy', 'Bhat', 'Ansari', 'Mitra', 'Menon', 'Noor', 'Prasad',
        'Mahmood', 'Saxena', 'Dutta', 'Lal', 'Vyas', 'Kale', 'Nizam', 'Kulkarni',
        'Bose', 'Srinath', 'Yella', 'Shukla', 'Dey', 'Pasha', 'Mandal', 'Raj'
      ]
    }
  ];

  function range(from, to) {
    var values = [];
    for (var value = from; value <= to; value += 1) values.push(value);
    return values;
  }

  function createRng(seed) {
    var state = seed >>> 0;
    return function random() {
      state += 0x6D2B79F5;
      var result = state;
      result = Math.imul(result ^ (result >>> 15), result | 1);
      result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
      return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
    };
  }

  function randomInteger(rng, minimum, maximum) {
    return minimum + Math.floor(rng() * (maximum - minimum + 1));
  }

  function pick(rng, values) {
    return values[Math.floor(rng() * values.length)];
  }

  function shuffle(rng, values) {
    var copy = values.slice();
    for (var index = copy.length - 1; index > 0; index -= 1) {
      var target = Math.floor(rng() * (index + 1));
      var temporary = copy[index];
      copy[index] = copy[target];
      copy[target] = temporary;
    }
    return copy;
  }

  function clamp(value, minimum, maximum) {
    return Math.max(minimum, Math.min(maximum, value));
  }

  function pad(number, width) {
    return String(number).padStart(width, '0');
  }

  function mean(values) {
    if (!values.length) return 0;
    var total = values.reduce(function sum(accumulator, value) { return accumulator + value; }, 0);
    return Math.round((total / values.length) * 10) / 10;
  }

  function isoDate(year, month, day) {
    return year + '-' + pad(month, 2) + '-' + pad(day, 2);
  }

  function dateOffset(baseYear, baseMonth, baseDay, offset) {
    var date = new Date(Date.UTC(baseYear, baseMonth - 1, baseDay + offset));
    return isoDate(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
  }

  function gradeFromPercentage(percentage) {
    if (percentage >= 91) return 'A1';
    if (percentage >= 81) return 'A2';
    if (percentage >= 71) return 'B1';
    if (percentage >= 61) return 'B2';
    if (percentage >= 51) return 'C1';
    if (percentage >= 41) return 'C2';
    if (percentage >= 33) return 'D';
    return 'E';
  }

  function makeSubjectRecords(blueprint) {
    return SUBJECT_CATALOGUE.map(function makeSubject(subject) {
      return {
        id: blueprint.id + '-subject-' + subject.key,
        tenantId: blueprint.id,
        key: subject.key,
        name: subject.name,
        code: subject.code,
        department: subject.department,
        applicableGrades: subject.grades.slice(),
        gradeLevels: subject.grades.slice(),
        active: true,
        createdAt: '2026-04-01T04:00:00.000Z'
      };
    });
  }

  function makeAcademicYears(tenantId) {
    return [
      {
        id: tenantId + '-academic-year-2024-25', tenantId: tenantId,
        name: '2024–25', code: '2024-25', startDate: '2024-06-10', endDate: '2025-04-12',
        status: 'Archived', isCurrent: false
      },
      {
        id: tenantId + '-academic-year-2025-26', tenantId: tenantId,
        name: '2025–26', code: '2025-26', startDate: '2025-06-09', endDate: '2026-04-11',
        status: 'Published', isCurrent: false
      },
      {
        id: tenantId + '-academic-year-2026-27', tenantId: tenantId,
        name: CURRENT_ACADEMIC_YEAR_LABEL, code: CURRENT_ACADEMIC_YEAR, startDate: '2026-06-08', endDate: '2027-04-10',
        status: 'Active', isCurrent: true
      }
    ];
  }

  function makeTeachers(blueprint, subjects, rng) {
    var subjectByKey = indexBy(subjects, 'key');
    return blueprint.teachers.map(function makeTeacher(person, index) {
      var specialties = TEACHING_SPECIALTIES[index];
      var subjectIds = specialties.map(function subjectId(key) { return subjectByKey[key].id; });
      var firstName = person[0];
      var lastName = person[1];
      var emailSlug = (firstName + '.' + lastName).toLowerCase().replace(/[^a-z]/g, '');
      var isCoordinator = index === 3 || index === 10;
      var attendance = makeTeacherAttendanceSummary(rng);
      return {
        id: blueprint.id + '-teacher-' + pad(index + 1, 3),
        tenantId: blueprint.id,
        userId: blueprint.id + '-user-teacher-' + pad(index + 1, 3),
        employeeId: 'NXL-' + blueprint.code + '-T-' + pad(index + 1, 3),
        firstName: firstName,
        lastName: lastName,
        fullName: firstName + ' ' + lastName,
        name: firstName + ' ' + lastName,
        gender: person[2],
        email: emailSlug + '.' + blueprint.code.toLowerCase() + '@notebookxl.demo',
        phone: '+91 900' + pad(100000 + index * 371 + randomInteger(rng, 0, 99), 6),
        designation: isCoordinator ? 'Academic Coordinator' : 'Teacher',
        roles: isCoordinator ? ['TEACHER', 'ACADEMIC_COORDINATOR'] : ['TEACHER'],
        department: subjectByKey[specialties[0]].department,
        subjectIds: subjectIds,
        subjectKeys: specialties.slice(),
        subjects: specialties.map(function subjectName(key) { return subjectByKey[key].name; }),
        joiningDate: isoDate(2016 + (index % 8), 6 + (index % 5), 3 + (index * 3 % 24)),
        qualification: index % 3 === 0 ? 'M.Ed., B.Ed.' : index % 3 === 1 ? 'M.Sc., B.Ed.' : 'B.A., B.Ed.',
        status: 'Active',
        attendance: attendance,
        attendanceRate: attendance.percentage,
        classTeacherOf: [],
        teachingAssignmentIds: [],
        assignments: [],
        workload: null
      };
    });
  }

  function makeTeacherAttendanceSummary(rng) {
    var totalDays = 180;
    var leaveDays = randomInteger(rng, 0, 4);
    var absentDays = randomInteger(rng, 0, 3);
    var lateDays = randomInteger(rng, 0, 5);
    var halfDays = randomInteger(rng, 0, 3);
    var presentDays = totalDays - leaveDays - absentDays - lateDays - halfDays;
    return {
      totalDays: totalDays,
      presentDays: presentDays,
      absentDays: absentDays,
      lateDays: lateDays,
      leaveDays: leaveDays,
      halfDays: halfDays,
      percentage: Math.round(((presentDays + lateDays * 0.75 + halfDays * 0.5) / totalDays) * 1000) / 10
    };
  }

  function makeClassSections(blueprint, subjects) {
    var byGrade = {};
    subjects.forEach(function addSubject(subject) {
      subject.applicableGrades.forEach(function addGrade(grade) {
        if (!byGrade[grade]) byGrade[grade] = [];
        byGrade[grade].push(subject.id);
      });
    });
    var sections = [];
    var allGrades = ['LKG', 'UKG', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    allGrades.forEach(function eachGrade(grade) {
      SECTIONS.forEach(function eachSection(section, index) {
        var gKey = typeof grade === 'number' ? grade : 1;
        sections.push({
          id: blueprint.id + '-class-g' + String(grade).toLowerCase() + '-' + section.toLowerCase(),
          tenantId: blueprint.id,
          academicYearId: blueprint.id + '-academic-year-2026-27',
          grade: grade,
          gradeName: typeof grade === 'string' ? grade : 'Grade ' + grade,
          section: section,
          name: (typeof grade === 'string' ? grade : 'Grade ' + grade) + ' - ' + section,
          room: 'Block ' + (grade === 'LKG' || grade === 'UKG' || grade <= 5 ? 'A' : 'B') + '-' + (101 + (typeof grade === 'number' ? grade * 10 : 10) + index),
          capacity: 25,
          subjectIds: (byGrade[gKey] || byGrade[1] || []).slice(),
          studentIds: [],
          classTeacherId: null
        });
      });
    });
    return sections;
  }

  function makeStudents(blueprint, classSections, rng) {
    var students = [];
    var maleNameNumber = 0;
    var femaleNameNumber = 0;
    classSections.forEach(function buildClassStudents(classSection) {
      for (var roll = 1; roll <= 25; roll += 1) {
        var gender = rng() < 0.5 ? 'Boy' : 'Girl';
        var nameNumber = gender === 'Boy' ? maleNameNumber++ : femaleNameNumber++;
        var firstNames = gender === 'Boy' ? blueprint.boyNames : blueprint.girlNames;
        /* Coprime multiplier makes every first/last pair unique per gender. */
        var firstName = firstNames[(nameNumber * 7 + 3) % firstNames.length];
        var lastName = blueprint.surnames[Math.floor(nameNumber / firstNames.length) % blueprint.surnames.length];
        var index = students.length;
        var numGrade = typeof classSection.grade === 'number' ? classSection.grade : (classSection.grade === 'LKG' ? -1 : 0);
        var birthYear = 2026 - (numGrade + 5) - (rng() < 0.48 ? 1 : 0);
        var dateOfBirth = isoDate(birthYear, randomInteger(rng, 1, 12), randomInteger(rng, 1, 28));
        var languageSubjectKey = chooseLanguageSubject(index, classSection.grade);
        var coreSubjectKeys = makeCoreSubjectKeys(classSection.grade, languageSubjectKey);
        var attendance = makeStudentAttendanceSummary(rng);
        var history = makeInitialAcademicHistory(blueprint, classSection, attendance, rng);
        var boyAvatars = [
          'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80'
        ];
        var girlAvatars = [
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80'
        ];
        var avatarUrl = (gender === 'Boy' ? boyAvatars : girlAvatars)[index % 5];
        var student = {
          id: blueprint.id + '-student-' + pad(index, 6),
          tenantId: blueprint.id,
          userId: blueprint.id + '-user-student-' + pad(index, 6),
          studentId: 'NXL-' + blueprint.code + '-' + pad(index, 6),
          admissionNumber: blueprint.code + '-ADM-' + (2016 + Math.max(0, 10 - numGrade)) + '-' + pad(index, 5),
          firstName: firstName,
          lastName: lastName,
          fullName: firstName + ' ' + lastName,
          name: firstName + ' ' + lastName,
          avatar: avatarUrl,
          avatarUrl: avatarUrl,
          photo: avatarUrl,
          gender: gender,
          dateOfBirth: dateOfBirth,
          age: 2026 - birthYear,
          grade: classSection.grade,
          gradeName: classSection.gradeName,
          section: classSection.section,
          classId: classSection.id,
          rollNumber: roll,
          academicYearId: blueprint.id + '-academic-year-2026-27',
          subjectIds: classSection.subjectIds.slice(),
          coreSubjectKeys: coreSubjectKeys.slice(),
          languageSubjectKey: languageSubjectKey,
          attendance: attendance,
          attendanceRate: attendance.percentage,
          academicHistory: history,
          academicAverage: history.length ? history[history.length - 1].academicAverage : 0,
          guardian: makeGuardian(blueprint, gender, lastName, index, rng),
          parentName: (gender === 'Boy' ? 'Mr. ' : 'Dr. ') + lastName,
          parentMobile: '+91 9845' + pad(10000 + index * 41 + randomInteger(rng, 0, 99), 6),
          motherName: 'Mrs. ' + (gender === 'Boy' ? 'Farzana ' : 'Nilofer ') + lastName,
          bloodGroup: ['O +ve', 'A +ve', 'B +ve', 'AB +ve', 'O -ve', 'A -ve'][(index * 7) % 6],
          status: 'Active'
        };
        students.push(student);
        classSection.studentIds.push(student.id);
      }
    });
    return students;
  }

  function chooseLanguageSubject(index, grade) {
    var numGrade = typeof grade === 'number' ? grade : 1;
    var languages = ['telugu', 'hindi', 'urdu'];
    return languages[(index + numGrade * 3) % languages.length];
  }

  function makeCoreSubjectKeys(grade, languageSubjectKey) {
    var numGrade = typeof grade === 'number' ? grade : 1;
    var science = numGrade <= 5 ? 'environmental-science' : 'science';
    var keys = ['mathematics', 'english', languageSubjectKey, science];
    if (numGrade >= 3) keys.push('social-science');
    else keys.push('general-knowledge');
    if (numGrade >= 8) keys.push('physics');
    return keys;
  }

  function makeStudentAttendanceSummary(rng) {
    var totalDays = 180;
    var absentDays = randomInteger(rng, 1, 16);
    var lateDays = randomInteger(rng, 0, 5);
    var excusedDays = randomInteger(rng, 0, 3);
    var presentDays = totalDays - absentDays - lateDays - excusedDays;
    var percentage = Math.round(((presentDays + lateDays * 0.75 + excusedDays * 0.5) / totalDays) * 1000) / 10;
    return {
      totalDays: totalDays,
      presentDays: presentDays,
      absentDays: absentDays,
      lateDays: lateDays,
      excusedDays: excusedDays,
      percentage: percentage
    };
  }

  function makeGuardian(blueprint, gender, lastName, index, rng) {
    var guardianFirstNames = gender === 'Boy'
      ? ['Sadia', 'Anita', 'Farzana', 'Kavitha', 'Latha', 'Nazia', 'Pallavi', 'Shabana']
      : ['Abdul', 'Ajay', 'Faisal', 'Krishna', 'Mahesh', 'Ramesh', 'Sanjay', 'Yusuf'];
    var relation = gender === 'Boy' ? (rng() < 0.82 ? 'Mother' : 'Father') : (rng() < 0.82 ? 'Father' : 'Mother');
    return {
      name: guardianFirstNames[index % guardianFirstNames.length] + ' ' + lastName,
      relation: relation,
      phone: '+91 98' + pad(10000000 + ((index * 7349) % 8999999), 8),
      email: 'guardian.' + blueprint.code.toLowerCase() + '.' + pad(index, 4) + '@notebookxl.demo'
    };
  }

  function makeAchievements(grade, index, rng) {
    if (rng() > 0.22) return [];
    var titles = [
      'Class Reading Champion', 'Science Quiz Finalist', 'Perfect Attendance Badge',
      'Art Showcase Selection', 'Young Coder Certificate', 'Sports Day Participation'
    ];
    return [{
      id: 'achievement-' + index,
      title: titles[(index + grade) % titles.length],
      awardedOn: isoDate(2026, 7 + (index % 2), 4 + (index % 20)),
      level: index % 3 === 0 ? 'School' : 'Class'
    }];
  }

  function makeInitialAcademicHistory(blueprint, classSection, attendance, rng) {
    var history = [];
    var periods = [
      { year: '2024-25', label: '2024–25', offset: 2 },
      { year: '2025-26', label: '2025–26', offset: 1 },
      { year: '2026-27', label: CURRENT_ACADEMIC_YEAR_LABEL, offset: 0 }
    ];
    periods.forEach(function eachPeriod(period) {
      var historicalGrade = classSection.grade - period.offset;
      if (historicalGrade < 1) return;
      var percentage = period.offset === 0 ? 0 : clamp(68 + randomInteger(rng, -13, 20), 48, 96);
      history.push({
        academicYearId: blueprint.id + '-academic-year-' + period.year,
        academicYear: period.label,
        grade: historicalGrade,
        gradeName: 'Grade ' + historicalGrade,
        section: SECTIONS[(SECTIONS.indexOf(classSection.section) + period.offset) % SECTIONS.length],
        attendancePercentage: period.offset === 0 ? attendance.percentage : clamp(attendance.percentage + randomInteger(rng, -4, 5), 82, 99),
        academicAverage: percentage,
        subjectAverages: [],
        published: period.offset > 0
      });
    });
    return history;
  }

  function makeTeachingAssignments(blueprint, teachers, classSections, subjects, rng) {
    var teachersBySubject = {};
    var subjectById = indexBy(subjects, 'id');
    teachers.forEach(function addTeacher(teacher) {
      teacher.subjectIds.forEach(function addSubject(subjectId) {
        if (!teachersBySubject[subjectId]) teachersBySubject[subjectId] = [];
        teachersBySubject[subjectId].push(teacher);
      });
    });

    var assignmentLoad = {};
    teachers.forEach(function initializeLoad(teacher) { assignmentLoad[teacher.id] = 0; });
    var assignments = [];
    classSections.forEach(function assignClass(classSection, classIndex) {
      classSection.subjectIds.forEach(function assignSubject(subjectId, subjectIndex) {
        var eligible = teachersBySubject[subjectId] || teachers;
        var ranked = shuffle(rng, eligible).sort(function byLoad(first, second) {
          return assignmentLoad[first.id] - assignmentLoad[second.id];
        });
        var teacher = ranked[(classIndex + subjectIndex) % Math.min(2, ranked.length)];
        assignmentLoad[teacher.id] += 1;
        var subject = subjectById[subjectId];
        var assignment = {
          id: blueprint.id + '-teaching-assignment-' + pad(assignments.length + 1, 4),
          tenantId: blueprint.id,
          academicYearId: blueprint.id + '-academic-year-2026-27',
          classId: classSection.id,
          grade: classSection.grade,
          section: classSection.section,
          subjectId: subjectId,
          subjectName: subject.name,
          teacherId: teacher.id,
          status: 'Active'
        };
        assignments.push(assignment);
        teacher.teachingAssignmentIds.push(assignment.id);
        teacher.assignments.push(assignment);
      });
    });

    var assignmentsByClass = groupBy(assignments, 'classId');
    var classTeacherLoad = {};
    teachers.forEach(function initializeClassTeacherLoad(teacher) { classTeacherLoad[teacher.id] = 0; });
    classSections.forEach(function chooseClassTeacher(classSection, index) {
      var possibilities = assignmentsByClass[classSection.id].map(function assignmentTeacher(assignment) {
        return teachers.find(function teacherById(teacher) { return teacher.id === assignment.teacherId; });
      });
      possibilities.sort(function leastClassTeacher(first, second) {
        return classTeacherLoad[first.id] - classTeacherLoad[second.id];
      });
      var classTeacher = possibilities[index % Math.min(2, possibilities.length)];
      classTeacherLoad[classTeacher.id] += 1;
      classTeacher.classTeacherOf.push(classSection.id);
      classSection.classTeacherId = classTeacher.id;
    });
    return assignments;
  }

  function makeTimetable(blueprint, teachers, teachingAssignments, classSections, subjects, rng) {
    var assignmentsByTeacher = groupBy(teachingAssignments, 'teacherId');
    var subjectById = indexBy(subjects, 'id');
    var timeSlots = [];
    DAYS.forEach(function everyDay(day) {
      PERIODS.forEach(function everyPeriod(period) {
        timeSlots.push({ day: day, period: period });
      });
    });
    var classroomSlotUse = {};
    var classRecordCount = {};
    classSections.forEach(function initClassCount(classSection) { classRecordCount[classSection.id] = 0; });
    var timetable = [];

    teachers.forEach(function scheduleTeacher(teacher, teacherIndex) {
      var teacherAssignments = assignmentsByTeacher[teacher.id] || [];
      var teacherSlots = shuffle(createRng(blueprint.seed + teacherIndex * 917), timeSlots)
        .slice(0, WEEKLY_PERIOD_TARGETS[teacherIndex]);
      teacherSlots.forEach(function scheduleSlot(slot, slotIndex) {
        var available = teacherAssignments.filter(function filterAvailable(assignment) {
          return !classroomSlotUse[assignment.classId + '|' + slot.day + '|' + slot.period.number];
        });
        /* A teacher with only a few specialty assignments still gets a
         * legitimate record; no tenant ever borrows an assignment from another. */
        if (!available.length) available = teacherAssignments;
        available.sort(function preferBalancedClass(first, second) {
          var countDifference = classRecordCount[first.classId] - classRecordCount[second.classId];
          if (countDifference) return countDifference;
          return first.id < second.id ? -1 : 1;
        });
        var selectionWindow = Math.min(4, available.length);
        var assignment = available[(slotIndex + teacherIndex) % selectionWindow];
        var period = slot.period;
        var subject = subjectById[assignment.subjectId];
        classroomSlotUse[assignment.classId + '|' + slot.day + '|' + period.number] = true;
        classRecordCount[assignment.classId] += 1;
        timetable.push({
          id: blueprint.id + '-timetable-' + pad(timetable.length + 1, 4),
          tenantId: blueprint.id,
          academicYearId: blueprint.id + '-academic-year-2026-27',
          classId: assignment.classId,
          grade: assignment.grade,
          section: assignment.section,
          day: slot.day,
          period: period.number,
          startTime: period.start,
          endTime: period.end,
          subjectId: subject.id,
          subjectName: subject.name,
          teacherId: teacher.id,
          room: classSections.find(function classById(classSection) { return classSection.id === assignment.classId; }).room
        });
      });
    });
    return timetable.sort(function byWeek(first, second) {
      var dayDifference = DAYS.indexOf(first.day) - DAYS.indexOf(second.day);
      return dayDifference || first.period - second.period || first.classId.localeCompare(second.classId);
    });
  }

  function makeAssessments(blueprint, teachingAssignments, subjects, rng) {
    var subjectById = indexBy(subjects, 'id');
    var teacherByGradeSubject = {};
    teachingAssignments.forEach(function registerTeacher(assignment) {
      var key = assignment.grade + '|' + assignment.subjectId;
      if (!teacherByGradeSubject[key]) teacherByGradeSubject[key] = assignment.teacherId;
    });
    var assessments = [];
    var assessmentIndex = {};
    range(1, 10).forEach(function eachGrade(grade) {
      subjects.filter(function appliesToGrade(subject) {
        return subject.applicableGrades.indexOf(grade) !== -1;
      }).forEach(function eachSubject(subject, subjectIndex) {
        var key = grade + '|' + subject.id;
        var types = [
          { type: 'Unit Test', title: 'Unit Test 1', maximumMarks: 25, date: isoDate(2026, 7, 8 + ((grade + subjectIndex) % 15)) },
          { type: grade >= 6 ? 'Mid Term' : 'Class Test', title: grade >= 6 ? 'Mid Term Assessment' : 'Class Test 1', maximumMarks: grade >= 6 ? 50 : 20, date: isoDate(2026, 8, 5 + ((grade * 2 + subjectIndex) % 18)) }
        ];
        assessmentIndex[key] = [];
        types.forEach(function createAssessment(definition, typeIndex) {
          var assessment = {
            id: blueprint.id + '-assessment-g' + grade + '-' + subject.key + '-' + (typeIndex + 1),
            tenantId: blueprint.id,
            academicYearId: blueprint.id + '-academic-year-2026-27',
            grade: grade,
            subjectId: subject.id,
            subjectName: subject.name,
            teacherId: teacherByGradeSubject[key],
            name: subject.name + ' ' + definition.title,
            type: definition.type,
            maximumMarks: definition.maximumMarks,
            assessmentDate: definition.date,
            status: 'Published',
            weightage: typeIndex === 0 ? 35 : 65
          };
          assessments.push(assessment);
          assessmentIndex[key].push(assessment);
        });
      });
    });
    return { assessments: assessments, assessmentIndex: assessmentIndex };
  }

  function makeMarks(blueprint, students, subjects, assessmentIndex, rng) {
    var subjectByKey = indexBy(subjects, 'key');
    var marks = [];
    students.forEach(function markStudent(student, studentIndex) {
      var baseline = clamp(58 + randomInteger(rng, 0, 35) + (studentIndex % 9 === 0 ? -12 : 0), 38, 96);
      var bySubject = {};
      student.coreSubjectKeys.forEach(function markSubject(subjectKey, subjectIndex) {
        var subject = subjectByKey[subjectKey];
        if (!subject) return;
        var availableAssessments = assessmentIndex[student.grade + '|' + subject.id] || assessmentIndex['1|' + subject.id] || [];
        var scores = [];
        availableAssessments.forEach(function markAssessment(assessment, assessmentIndexNumber) {
          var percentage = clamp(
            baseline + randomInteger(rng, -12, 12) + ((studentIndex + subjectIndex + assessmentIndexNumber) % 7 === 0 ? -8 : 0),
            33,
            100
          );
          var score = Math.round((percentage / 100) * assessment.maximumMarks);
          var normalized = Math.round((score / assessment.maximumMarks) * 1000) / 10;
          scores.push(normalized);
          marks.push({
            id: blueprint.id + '-mark-' + pad(marks.length + 1, 6),
            tenantId: blueprint.id,
            academicYearId: blueprint.id + '-academic-year-2026-27',
            studentId: student.id,
            classId: student.classId,
            grade: student.grade,
            section: student.section,
            subjectId: subject.id,
            subjectName: subject.name,
            assessmentId: assessment.id,
            assessmentName: assessment.name,
            assessmentType: assessment.type,
            score: score,
            maximumMarks: assessment.maximumMarks,
            percentage: normalized,
            gradeLabel: gradeFromPercentage(normalized),
            status: 'Published',
            enteredOn: dateOffset(2026, 8, 18, (studentIndex + subjectIndex) % 9)
          });
        });
        bySubject[subjectKey] = mean(scores);
      });
      student.subjectPerformance = Object.keys(bySubject).map(function makeSubjectPerformance(subjectKey) {
        return {
          subjectId: subjectByKey[subjectKey].id,
          subjectName: subjectByKey[subjectKey].name,
          percentage: bySubject[subjectKey],
          gradeLabel: gradeFromPercentage(bySubject[subjectKey])
        };
      });
      student.academicAverage = mean(student.subjectPerformance.map(function subjectAverage(item) { return item.percentage; }));
      updateStudentAcademicHistory(student, rng);
    });
    return marks;
  }

  function updateStudentAcademicHistory(student, rng) {
    var current = student.academicHistory.find(function currentYear(history) {
      return history.academicYear === CURRENT_ACADEMIC_YEAR_LABEL;
    });
    if (current) {
      current.academicAverage = student.academicAverage;
      current.subjectAverages = student.subjectPerformance.map(function currentSubject(item) {
        return { subjectName: item.subjectName, percentage: item.percentage };
      });
      current.published = true;
    }
    student.academicHistory.forEach(function historicalPerformance(history) {
      if (history.academicYear === CURRENT_ACADEMIC_YEAR_LABEL) return;
      var historicalSubjects = student.subjectPerformance.slice(0, 5).map(function historicalSubject(item) {
        return {
          subjectName: item.subjectName,
          percentage: clamp(item.percentage + randomInteger(rng, -9, 7), 45, 96)
        };
      });
      history.subjectAverages = historicalSubjects;
      history.academicAverage = mean(historicalSubjects.map(function historicAverage(item) { return item.percentage; }));
    });
  }

  function makeAttendanceRecords(blueprint, students, teachers, rng) {
    var studentRecords = [];
    var teacherRecords = [];
    var attendanceDays = [
      '2026-08-03', '2026-08-04', '2026-08-05', '2026-08-06', '2026-08-07',
      '2026-08-10', '2026-08-11', '2026-08-12', '2026-08-13', '2026-08-14',
      '2026-08-17', '2026-08-18'
    ];
    students.forEach(function eachStudent(student, studentIndex) {
      attendanceDays.forEach(function eachDay(date, dayIndex) {
        var roll = rng();
        var status = roll < 0.91 ? 'Present' : roll < 0.945 ? 'Late' : roll < 0.981 ? 'Absent' : 'Excused';
        if (dayIndex === attendanceDays.length - 1) student.latestAttendanceStatus = status;
        studentRecords.push({
          id: blueprint.id + '-student-attendance-' + pad(studentRecords.length + 1, 6),
          tenantId: blueprint.id,
          academicYearId: blueprint.id + '-academic-year-2026-27',
          studentId: student.id,
          classId: student.classId,
          date: date,
          status: status,
          markedBy: 'system-seed',
          note: status === 'Absent' && (studentIndex + dayIndex) % 5 === 0 ? 'Parent informed' : ''
        });
      });
    });
    teachers.forEach(function eachTeacher(teacher, teacherIndex) {
      attendanceDays.forEach(function eachDay(date, dayIndex) {
        var roll = rng();
        var status = roll < 0.945 ? 'Present' : roll < 0.965 ? 'Late' : roll < 0.982 ? 'Half Day' : roll < 0.992 ? 'Leave' : 'Absent';
        teacherRecords.push({
          id: blueprint.id + '-teacher-attendance-' + pad(teacherRecords.length + 1, 4),
          tenantId: blueprint.id,
          academicYearId: blueprint.id + '-academic-year-2026-27',
          teacherId: teacher.id,
          date: date,
          status: status,
          note: status === 'Leave' ? 'Approved leave' : (teacherIndex + dayIndex) % 23 === 0 ? 'Morning assembly duty' : ''
        });
      });
    });
    return { studentAttendanceRecords: studentRecords, teacherAttendanceRecords: teacherRecords };
  }

  function makeAssignments(blueprint, teachingAssignments, classSections, students, subjects, rng) {
    var subjectById = indexBy(subjects, 'id');
    var studentsByClass = groupBy(students, 'classId');
    var assignments = [];
    var submissions = [];
    var taskTitles = [
      'Practice worksheet', 'Concept map', 'Revision exercises', 'Reading reflection',
      'Lab observation', 'Chapter quiz preparation', 'Creative project', 'Problem set'
    ];
    var selectedAssignments = shuffle(rng, teachingAssignments).slice(0, 48);
    selectedAssignments.forEach(function createAssignment(teachingAssignment, index) {
      var subject = subjectById[teachingAssignment.subjectId];
      var classSection = classSections.find(function matchingClass(item) { return item.id === teachingAssignment.classId; });
      var dateOffsetValue = (index * 2 + randomInteger(rng, 0, 3)) % 26;
      var publishedOn = dateOffset(2026, 8, 1, dateOffsetValue);
      var dueDate = dateOffset(2026, 8, 4, dateOffsetValue + 3 + (index % 5));
      var assignment = {
        id: blueprint.id + '-assignment-' + pad(index + 1, 3),
        tenantId: blueprint.id,
        academicYearId: blueprint.id + '-academic-year-2026-27',
        title: subject.name + ': ' + taskTitles[index % taskTitles.length],
        instructions: 'Complete the assigned ' + subject.name.toLowerCase() + ' activity and submit it before the due date.',
        type: index % 5 === 0 ? 'Project' : index % 3 === 0 ? 'Worksheet' : 'Homework',
        classId: teachingAssignment.classId,
        grade: teachingAssignment.grade,
        section: teachingAssignment.section,
        className: classSection.name,
        subjectId: subject.id,
        subjectName: subject.name,
        teacherId: teachingAssignment.teacherId,
        publishedOn: publishedOn,
        dueDate: dueDate,
        maximumMarks: index % 5 === 0 ? 20 : 10,
        status: index % 13 === 0 ? 'Draft' : 'Published',
        attachmentName: index % 4 === 0 ? subject.code + '-activity-sheet.pdf' : null
      };
      assignments.push(assignment);
      (studentsByClass[teachingAssignment.classId] || []).forEach(function makeSubmission(student, studentIndex) {
        var roll = rng();
        var status = roll < 0.79 ? 'Completed' : roll < 0.89 ? 'Pending' : roll < 0.96 ? 'Late' : 'Not Started';
        var score = status === 'Completed' || status === 'Late'
          ? randomInteger(rng, Math.ceil(assignment.maximumMarks * 0.55), assignment.maximumMarks)
          : null;
        submissions.push({
          id: blueprint.id + '-submission-' + pad(submissions.length + 1, 5),
          tenantId: blueprint.id,
          assignmentId: assignment.id,
          studentId: student.id,
          classId: student.classId,
          status: status,
          submittedOn: status === 'Completed' ? dateOffset(2026, 8, 2, dateOffsetValue + (studentIndex % 4)) : status === 'Late' ? dateOffset(2026, 8, 10, dateOffsetValue + (studentIndex % 4)) : null,
          score: score,
          maximumMarks: assignment.maximumMarks,
          feedback: status === 'Late' ? 'Please submit the next activity on time.' : status === 'Completed' && score >= assignment.maximumMarks * 0.9 ? 'Excellent work.' : ''
        });
      });
    });
    updateAssignmentSummaries(students, submissions);
    return { assignments: assignments, assignmentSubmissions: submissions };
  }

  function updateAssignmentSummaries(students, submissions) {
    var byStudent = groupBy(submissions, 'studentId');
    students.forEach(function updateStudent(student) {
      var items = byStudent[student.id] || [];
      var completed = items.filter(function completedItem(item) { return item.status === 'Completed'; }).length;
      var pending = items.filter(function pendingItem(item) { return item.status === 'Pending' || item.status === 'Not Started'; }).length;
      var late = items.filter(function lateItem(item) { return item.status === 'Late'; }).length;
      student.assignmentSummary = {
        assigned: items.length,
        completed: completed,
        pending: pending,
        late: late,
        completionRate: items.length ? Math.round(((completed + late) / items.length) * 1000) / 10 : 0
      };
    });
  }

  function makeTasks(blueprint, teachers, rng) {
    var titles = [
      'Prepare Grade 8 Mathematics Unit Test',
      'Review weekly attendance follow-ups',
      'Upload August lesson plan',
      'Coordinate Science Day activity',
      'Publish assessment feedback',
      'Prepare remedial learning list',
      'Update class display board',
      'Submit subject enrichment plan',
      'Complete notebook review',
      'Share assembly activity roster',
      'Verify assessment mark entry',
      'Organise library reading circle'
    ];
    var priorities = ['High', 'Medium', 'Low'];
    var statuses = ['Not Started', 'In Progress', 'Completed', 'Overdue'];
    return titles.map(function makeTask(title, index) {
      var teacher = teachers[(index * 7 + 2) % teachers.length];
      return {
        id: blueprint.id + '-task-' + pad(index + 1, 3),
        tenantId: blueprint.id,
        title: title,
        description: 'School operations task for the current academic cycle.',
        assignedTo: teacher.id,
        assignedBy: blueprint.id + '-school-admin',
        dueDate: isoDate(2026, 8, 16 + index),
        priority: priorities[(index + randomInteger(rng, 0, 1)) % priorities.length],
        status: statuses[(index + (rng() > 0.5 ? 1 : 0)) % statuses.length],
        createdAt: isoDate(2026, 8, 3 + (index % 6))
      };
    });
  }

  function makeTeacherWorkloads(teachers, timetable, teachingAssignments, assignments, tasks, students, classSections, assessmentCount) {
    var timetableByTeacher = groupBy(timetable, 'teacherId');
    var teachingByTeacher = groupBy(teachingAssignments, 'teacherId');
    var assignmentsByTeacher = groupBy(assignments, 'teacherId');
    var tasksByTeacher = groupBy(tasks, 'assignedTo');
    var classById = indexBy(classSections, 'id');
    return teachers.map(function makeWorkload(teacher) {
      var periods = timetableByTeacher[teacher.id] || [];
      var assignmentsForTeacher = teachingByTeacher[teacher.id] || [];
      var classes = unique(assignmentsForTeacher.map(function classId(item) { return item.classId; }));
      var studentCount = classes.reduce(function countStudents(total, classId) {
        return total + ((classById[classId] || { studentIds: [] }).studentIds.length);
      }, 0);
      var activeAssignments = (assignmentsByTeacher[teacher.id] || []).filter(function active(item) { return item.status === 'Published'; }).length;
      var ownTasks = tasksByTeacher[teacher.id] || [];
      var pendingTasks = ownTasks.filter(function pending(item) { return item.status !== 'Completed'; }).length;
      var workload = {
        teacherId: teacher.id,
        classes: classes.length,
        classIds: classes,
        subjects: teacher.subjectIds.length,
        subjectIds: teacher.subjectIds.slice(),
        students: studentCount,
        weeklyPeriods: periods.length,
        lessonPlanCompletion: 82 + ((periods.length * 3 + classes.length * 2) % 17),
        activeAssignments: activeAssignments,
        pendingReviews: Math.max(1, Math.round(activeAssignments * 2.2 + pendingTasks)),
        upcomingAssessments: Math.max(1, Math.round(assessmentCount / 50) + teacher.classTeacherOf.length),
        pendingTasks: pendingTasks,
        utilization: Math.round((periods.length / 35) * 100)
      };
      teacher.workload = workload;
      return workload;
    });
  }

  function makeDashboard(blueprint, students, teachers, classSections, marks, assignments, submissions, workloads, subjects) {
    var studentAttendance = mean(students.map(function attendance(student) { return student.attendance.percentage; }));
    var teacherAttendance = mean(teachers.map(function attendance(teacher) { return teacher.attendance.percentage; }));
    var academicAverage = mean(students.map(function average(student) { return student.academicAverage; }));
    var submittedCount = submissions.filter(function submitted(item) { return item.status === 'Completed' || item.status === 'Late'; }).length;
    var assignmentCompletion = Math.round((submittedCount / submissions.length) * 1000) / 10;
    var gradePerformance = range(1, 10).map(function gradeMetric(grade) {
      var group = students.filter(function inGrade(student) { return student.grade === grade; });
      return {
        grade: 'Grade ' + grade,
        attendance: mean(group.map(function item(student) { return student.attendance.percentage; })),
        academicAverage: mean(group.map(function item(student) { return student.academicAverage; }))
      };
    });
    var subjectPerformance = subjects.map(function subjectMetric(subject) {
      var subjectMarks = marks.filter(function matchingMark(mark) { return mark.subjectId === subject.id; });
      return {
        subjectId: subject.id,
        subjectName: subject.name,
        average: mean(subjectMarks.map(function score(mark) { return mark.percentage; })),
        records: subjectMarks.length
      };
    }).filter(function hasMarks(metric) { return metric.records > 0; });
    var attendanceTrend = [
      ['Jul 20', -1.1], ['Jul 27', -0.5], ['Aug 03', 0.2], ['Aug 10', 0.6], ['Aug 17', 0.1], ['Aug 24', 0.8]
    ].map(function trend(point, index) {
      return { label: point[0], attendance: clamp(Math.round((studentAttendance + point[1] + (index % 2 ? 0.2 : -0.1)) * 10) / 10, 80, 100) };
    });
    var metrics = {
      studentCount: students.length,
      teacherCount: teachers.length,
      classCount: classSections.length,
      subjectCount: subjects.length,
      studentAttendance: studentAttendance,
      teacherAttendance: teacherAttendance,
      academicAverage: academicAverage,
      assignmentCompletion: assignmentCompletion
    };
    return {
      schoolName: blueprint.schoolName,
      academicYear: CURRENT_ACADEMIC_YEAR_LABEL,
      students: students.length,
      teachers: teachers.length,
      classes: classSections.length,
      subjects: subjects.length,
      studentAttendance: studentAttendance,
      teacherAttendance: teacherAttendance,
      academicAverage: academicAverage,
      assignmentCompletion: assignmentCompletion,
      metrics: metrics,
      activeAssignments: assignments.filter(function active(item) { return item.status === 'Published'; }).length,
      attendanceTrend: attendanceTrend,
      gradePerformance: gradePerformance,
      subjectPerformance: subjectPerformance,
      teacherWorkload: workloads.map(function workloadMetric(item) {
        return { teacherId: item.teacherId, weeklyPeriods: item.weeklyPeriods, utilization: item.utilization };
      })
    };
  }

  function makeTenant(blueprint) {
    var rng = createRng(blueprint.seed);
    var subjects = makeSubjectRecords(blueprint);
    var academicYears = makeAcademicYears(blueprint.id);
    var teachers = makeTeachers(blueprint, subjects, rng);
    var classSections = makeClassSections(blueprint, subjects);
    var students = makeStudents(blueprint, classSections, rng);
    var teachingAssignments = makeTeachingAssignments(blueprint, teachers, classSections, subjects, rng);
    var timetable = makeTimetable(blueprint, teachers, teachingAssignments, classSections, subjects, rng);
    var assessmentData = makeAssessments(blueprint, teachingAssignments, subjects, rng);
    var marks = makeMarks(blueprint, students, subjects, assessmentData.assessmentIndex, rng);
    var attendanceData = makeAttendanceRecords(blueprint, students, teachers, rng);
    var assignmentData = makeAssignments(blueprint, teachingAssignments, classSections, students, subjects, rng);
    var tasks = makeTasks(blueprint, teachers, rng);
    var workloads = makeTeacherWorkloads(
      teachers, timetable, teachingAssignments, assignmentData.assignments, tasks, students,
      classSections, assessmentData.assessments.length
    );
    var dashboard = makeDashboard(
      blueprint, students, teachers, classSections, marks, assignmentData.assignments,
      assignmentData.assignmentSubmissions, workloads, subjects
    );
    var tenant = {
      id: blueprint.id,
      slug: blueprint.slug,
      code: blueprint.code,
      school: {
        id: blueprint.id,
        tenantId: blueprint.id,
        name: blueprint.schoolName,
        shortName: blueprint.shortName,
        location: 'Hyderabad, Telangana, India',
        address: blueprint.address,
        country: 'India',
        timezone: 'Asia/Kolkata',
        academicModel: 'Indian school',
        branding: { primaryColor: blueprint.primaryColor, accentColor: blueprint.accentColor, initials: blueprint.code },
        status: 'Active'
      },
      settings: {
        tenantId: blueprint.id,
        currentAcademicYearId: blueprint.id + '-academic-year-2026-27',
        attendanceStatuses: ['Present', 'Absent', 'Late', 'Excused'],
        teacherAttendanceStatuses: ['Present', 'Absent', 'Late', 'Leave', 'Half Day'],
        assessmentTypes: ['Unit Test', 'Class Test', 'Mid Term', 'Quarterly', 'Half Yearly', 'Pre-Final', 'Final', 'Assignment', 'Project', 'Practical'],
        enabledFeatures: ['attendance', 'assignments', 'assessments', 'timetable', 'lesson-plans', 'aira'],
        allowTeacherSubjectProposals: true
      },
      academicYears: academicYears,
      subjects: subjects,
      grades: range(1, 10).map(function gradeRecord(grade) {
        return {
          id: blueprint.id + '-grade-' + grade,
          tenantId: blueprint.id,
          academicYearId: blueprint.id + '-academic-year-2026-27',
          number: grade,
          name: 'Grade ' + grade,
          sectionIds: classSections.filter(function sectionForGrade(item) { return item.grade === grade; }).map(function sectionId(item) { return item.id; }),
          subjectIds: subjects.filter(function subjectForGrade(item) { return item.applicableGrades.indexOf(grade) !== -1; }).map(function subjectId(item) { return item.id; })
        };
      }),
      classSections: classSections,
      teachers: teachers,
      students: students,
      teachingAssignments: teachingAssignments,
      timetable: timetable,
      assessments: assessmentData.assessments,
      marks: marks,
      assignments: assignmentData.assignments,
      assignmentSubmissions: assignmentData.assignmentSubmissions,
      studentAttendanceRecords: attendanceData.studentAttendanceRecords,
      teacherAttendanceRecords: attendanceData.teacherAttendanceRecords,
      tasks: tasks,
      teacherWorkloads: workloads,
      dashboard: dashboard,
      demoAccounts: makeDemoAccounts(blueprint, teachers, students),
      generatedCounts: {
        students: students.length,
        teachers: teachers.length,
        classSections: classSections.length,
        subjects: subjects.length,
        attendanceRecords: attendanceData.studentAttendanceRecords.length,
        marks: marks.length,
        assignments: assignmentData.assignments.length,
        timetableEntries: timetable.length
      }
    };
    return tenant;
  }

  function makeDemoAccounts(blueprint, teachers, students) {
    return [
      {
        id: blueprint.id + '-school-admin', tenantId: blueprint.id, role: 'SCHOOL_ADMIN',
        name: 'School Administrator', userId: 'admin@' + blueprint.slug + '.demo',
        password: 'NotebookXL@2026'
      },
      {
        id: teachers[0].userId, tenantId: blueprint.id, role: 'TEACHER',
        name: teachers[0].fullName, userId: teachers[0].email, password: 'Teacher@2026', teacherId: teachers[0].id
      },
      {
        id: students[420].userId, tenantId: blueprint.id, role: 'STUDENT',
        name: students[420].fullName, userId: students[420].studentId, password: 'Student@2026', studentId: students[420].id
      }
    ];
  }

  function indexBy(records, property) {
    return records.reduce(function makeIndex(index, record) {
      index[record[property]] = record;
      return index;
    }, {});
  }

  function groupBy(records, property) {
    return records.reduce(function makeGroups(groups, record) {
      var key = record[property];
      if (!groups[key]) groups[key] = [];
      groups[key].push(record);
      return groups;
    }, {});
  }

  function unique(values) {
    return values.filter(function once(value, index) { return values.indexOf(value) === index; });
  }

  var tenants = TENANT_BLUEPRINTS.map(makeTenant);
  var tenantsBySlug = tenants.reduce(function tenantIndex(index, tenant) {
    index[tenant.slug] = tenant;
    return index;
  }, {});
  var NOTEBOOKXL_SEED = {
    schemaVersion: '1.0.0',
    generatedFor: 'NotebookXL prototype',
    generatedAt: '2026-08-13T00:00:00.000Z',
    currentAcademicYear: CURRENT_ACADEMIC_YEAR,
    currentAcademicYearLabel: CURRENT_ACADEMIC_YEAR_LABEL,
    roles: ROLES.slice(),
    tenants: tenants,
    tenantsBySlug: tenantsBySlug,
    getTenant: function getTenant(slug) { return tenantsBySlug[slug] || null; }
  };

  globalScope.NOTEBOOKXL_SEED = NOTEBOOKXL_SEED;
  if (typeof module !== 'undefined' && module.exports) module.exports = NOTEBOOKXL_SEED;
}(typeof globalThis !== 'undefined' ? globalThis : this));
