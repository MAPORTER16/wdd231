const courses = [
    {
        subject: 'CSE',
        number: 110,
        title: 'Introduction to Programming',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course will introduce students to programming. It will introduce the building blocks of programming languages (variables, decisions, calculations, loops, array, and input/output) and use them to solve problems.',
        technology: [
            'Python'
        ],
        completed: true
    },
    {
        subject: 'WDD',
        number: 130,
        title: 'Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course introduces students to the World Wide Web and to careers in web site design and development. The course is hands on with students actually participating in simple web designs and programming. It is anticipated that students who complete this course will understand the fields of web design and development and will have a good idea if they want to pursue this degree as a major.',
        technology: [
            'HTML',
            'CSS'
        ],
        completed: true
    },
    {
        subject: 'CSE',
        number: 111,
        title: 'Programming with Functions',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'CSE 111 students become more organized, efficient, and powerful computer programmers by learning to research and call functions written by others; to write, call , debug, and test their own functions; and to handle errors within functions. CSE 111 students write programs with functions to solve problems in many disciplines, including business, physical science, human performance, and humanities.',
        technology: [
            'Python'
        ],
        completed: true
    },
    {
        subject: 'CSE',
        number: 210,
        title: 'Programming with Classes',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course will introduce the notion of classes and objects. It will present encapsulation at a conceptual level. It will also work with inheritance and polymorphism.',
        technology: [
            'C#'
        ],
        completed: false
    },
    {
        subject: 'WDD',
        number: 131,
        title: 'Dynamic Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course builds on prior experience in Web Fundamentals and programming. Students will learn to create dynamic websites that use JavaScript to respond to events, update content, and create responsive user experiences.',
        technology: [
            'HTML',
            'CSS',
            'JavaScript'
        ],
        completed: true
    },
    {
        subject: 'WDD',
        number: 231,
        title: 'Frontend Web Development I',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course builds on prior experience with Dynamic Web Fundamentals and programming. Students will focus on user experience, accessibility, compliance, performance optimization, and basic API usage.',
        technology: [
            'HTML',
            'CSS',
            'JavaScript'
        ],
        completed: false
    }
]

function createCourseCard(course) {
    // 1. Create a div element
    const card = document.createElement('div');

    // 2. Add CSS classes - what classes do you think you need?
    card.className = `course-card ${course.completed ? 'completed' : 'incomplete'}`;
    card.dataset.subject = course.subject.toLowerCase();

    // 3. Set the inner HTML - what information should be displayed?
    card.innerHTML = `
        <h3>${course.subject} ${course.number}</h3>
        <p><strong>${course.title}</strong></p>
        <p>Credits: ${course.credits}</p>
        <p class="status">${course.completed ? '✓ Completed' : '○ Not Completed'}</p>
    `;

    return card;
}

// Function to display courses
function displayCourses(coursesToShow) {
    const courseGrid = document.querySelector('.course-grid');
    courseGrid.innerHTML = ''; // Clear existing cards

    coursesToShow.forEach(course => {
        const courseCard = createCourseCard(course);
        courseGrid.appendChild(courseCard);
    });

    updateCreditTotal(coursesToShow);
}

// Function to update credit total using reduce
function updateCreditTotal(coursesToShow) {
    const totalCredits = coursesToShow.reduce((sum, course) => sum + course.credits, 0);
    document.getElementById('total-credits').textContent = totalCredits;
}

// Function to filter courses
function filterCourses(filter) {
    let filteredCourses;

    switch (filter) {
        case 'cse':
            filteredCourses = courses.filter(course => course.subject === 'CSE');
            break;
        case 'wdd':
            filteredCourses = courses.filter(course => course.subject === 'WDD');
            break;
        case 'all':
        default:
            filteredCourses = courses;
            break;
    }

    displayCourses(filteredCourses);
}

// Event listeners for filter buttons
document.addEventListener('DOMContentLoaded', function () {
    // Display all courses initially
    displayCourses(courses);

    // Add click event listeners to filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            // Filter courses based on data-filter attribute
            const filter = this.dataset.filter;
            filterCourses(filter);
        });
    });
});


