let studentData = [];
let isDescendingOrder = false;
let currentSortKey = null;
let currentGender = null;

async function fetchStudentData() {
    try {
        const response = await fetch('https://gist.githubusercontent.com/harsh3195/b441881e0020817b84e34d27ba448418/raw/c4fde6f42310987a54ae1bc3d9b8bfbafac15617/demo-json-data.json');
        if (!response.ok) {
            throw new Error('Error');
        }
        const data = await response.json();
        studentData = data;
        populateTable(studentData);
    } catch (error) {
        console.error('Error fetching student data:', error);
    }
}


function populateTable(data) {
    const tableBody = document.querySelector('table tbody');
    tableBody.innerHTML = '';

    data.forEach((student, index) => {
        const fullName = `${student.first_name} ${student.last_name}`;
        const passingStatus = student.passing ? 'Passing' : 'Failed';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="col-1">${index + 1}</td>
            <td class="col">
                <span><img height="28px" width="28px" src="${student.img_src}" alt="${fullName}"></span>
                <span>${fullName}</span>
            </td>
            <td class="col">${student.gender}</td>
            <td class="col">${student.class}</td>
            <td class="col">${student.marks}</td>
            <td class="col-1">${passingStatus}</td>
            <td class="col-2">${student.email}</td>
        `;
        tableBody.appendChild(row);
    });
}


function updateTable(sortKey) {
    const sortedData = [...studentData];

    if (sortKey === 'name') {
        sortedData.sort((a, b) => {
            const nameA = `${a.first_name} ${a.last_name}`;
            const nameB = `${b.first_name} ${b.last_name}`;
            if (isDescendingOrder) {
                return nameB.localeCompare(nameA);
            } else {
                return nameA.localeCompare(nameB);
            }
        });
    } else if (sortKey === 'marks') {
        sortedData.sort((a, b) => {
            if (isDescendingOrder) {
                return b.marks - a.marks;
            } else {
                return a.marks - b.marks;
            }
        });
    } else if (sortKey === 'passing') {
        sortedData = sortedData.filter(student => student.passing);
    } else if (sortKey === 'class') {
        sortedData.sort((a, b) => {
            if (isDescendingOrder) {
                return b.class - a.class;
            } else {
                return a.class - b.class;
            }
        });
    } else if (sortKey === 'gender') {
        const maleStudents = studentData.filter(student => student.gender === 'Male');
        const femaleStudents = studentData.filter(student => student.gender === 'Female');
        displayGenderTables(maleStudents, femaleStudents);
        return;
    }

    populateTable(sortedData);
    currentSortKey = sortKey;
}

function displayGenderTables(maleStudents, femaleStudents) {
    const maleTable = document.createElement('table');
    const femaleTable = document.createElement('table');

    maleTable.innerHTML = `
        <thead>
            <tr>
                <th class="col-1">ID</th>
                <th class="col">Name</th>
                <th class="col">Gender</th>
                <th class="col">Class</th>
                <th class="col">Marks</th>
                <th class="col-1">Passing</th>
                <th class="col-2">Email</th>
            </tr>
        </thead>
        <tbody>
            <!-- Table rows for male students will be generated dynamically -->
        </tbody>
    `;

    femaleTable.innerHTML = `
        <thead>
            <tr>
                <th class="col-1">ID</th>
                <th class="col">Name</th>
                <th class="col">Gender</th>
                <th class="col">Class</th>
                <th class="col">Marks</th>
                <th class="col-1">Passing</th>
                <th class="col-2">Email</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    `;

    populateTable(maleStudents, maleTable.querySelector('tbody'));
    populateTable(femaleStudents, femaleTable.querySelector('tbody'));

    document.body.appendChild(maleTable);
    document.body.appendChild(femaleTable);
}


document.getElementById('searchButton').addEventListener('click', () => {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const filteredData = studentData.filter(student => {
        const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
        const email = student.email.toLowerCase();
        return fullName.includes(searchInput) || email.includes(searchInput);
    });
    populateTable(filteredData);
});


document.querySelector('.sortAZ').addEventListener('click', () => {
    isDescendingOrder = false;
    updateTable('name');
});

document.querySelector('.sortZA').addEventListener('click', () => {
    isDescendingOrder = true;
    updateTable('name');
});

document.querySelector('.sortByMarks').addEventListener('click', () => {
    isDescendingOrder = false;
    updateTable('marks');
});

document.querySelector('.sortByPassing').addEventListener('click', () => {
    updateTable('passing');
});

document.querySelector('.sortByClass').addEventListener('click', () => {
    isDescendingOrder = false;
    updateTable('class');
});

document.querySelector('.sortByGender').addEventListener('click', () => {
    updateTable('gender');
});

fetchStudentData();

