document.addEventListener('DOMContentLoaded', async () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
        window.location.href = '/';
        return;
    }
    const user = JSON.parse(userStr);
    document.getElementById('userNameDisplay').textContent = `${user.username} (${user.role})`;

    await loadPatients();

    document.getElementById('editPatientForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('editPatientId').value;
        const name = document.getElementById('editName').value;
        const age = document.getElementById('editAge').value;
        const gender = document.getElementById('editGender').value;
        const medicalHistory = document.getElementById('editHistory').value;

        try {
            await apiFetch(`/patients/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ name, age, gender, medicalHistory })
            });
            const modal = bootstrap.Modal.getInstance(document.getElementById('editPatientModal'));
            modal.hide();
            loadPatients(); // Refresh list
        } catch (err) {
            alert('Failed to update patient: ' + err.message);
        }
    });
});

async function loadPatients() {
    try {
        const patients = await apiFetch('/patients');
        const tbody = document.getElementById('patientsTableBody');
        tbody.innerHTML = '';
        
        patients.forEach(p => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${p.id}</td>
                <td>${p.name}</td>
                <td>${p.age}</td>
                <td>${p.gender}</td>
                <td>${p.medicalHistory || 'None'}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick='openEditModal(${JSON.stringify(p)})'>Edit</button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deletePatient(${p.id})">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        document.getElementById('patientsTableBody').innerHTML = `<tr><td colspan="6" class="text-center text-danger">Failed to load patients</td></tr>`;
    }
}

function openEditModal(patient) {
    document.getElementById('editPatientId').value = patient.id;
    document.getElementById('editName').value = patient.name;
    document.getElementById('editAge').value = patient.age;
    document.getElementById('editGender').value = patient.gender || 'Male';
    document.getElementById('editHistory').value = patient.medicalHistory || '';
    const modal = new bootstrap.Modal(document.getElementById('editPatientModal'));
    modal.show();
}

async function deletePatient(id) {
    if(!confirm('Are you sure you want to delete this patient?')) return;
    try {
        await apiFetch(`/patients/${id}`, { method: 'DELETE' });
        loadPatients();
    } catch (e) {
        alert('Delete failed: ' + e.message);
    }
}

function logout() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    window.location.href = '/';
}
