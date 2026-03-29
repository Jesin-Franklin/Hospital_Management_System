document.addEventListener('DOMContentLoaded', async () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
        window.location.href = '/';
        return;
    }
    const user = JSON.parse(userStr);
    document.getElementById('userNameDisplay').textContent = `${user.username} (${user.role})`;

    await loadDoctors();

    document.getElementById('editDoctorForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('editDoctorId').value;
        const name = document.getElementById('editDocName').value;
        const specialization = document.getElementById('editDocSpec').value;
        const schedule = document.getElementById('editDocSchedule').value;

        try {
            await apiFetch(`/doctors/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ name, specialization, schedule })
            });
            const modal = bootstrap.Modal.getInstance(document.getElementById('editDoctorModal'));
            modal.hide();
            loadDoctors(); 
        } catch (err) {
            alert('Failed to update doctor: ' + err.message);
        }
    });
});

async function loadDoctors() {
    try {
        const doctors = await apiFetch('/doctors');
        const tbody = document.getElementById('doctorsTableBody');
        tbody.innerHTML = '';
        
        doctors.forEach(d => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${d.id}</td>
                <td>Dr. ${d.name}</td>
                <td><span class="badge bg-info text-dark">${d.specialization}</span></td>
                <td>${d.schedule || 'Not Set'}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick='openEditModal(${JSON.stringify(d)})'>Edit</button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteDoctor(${d.id})">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        document.getElementById('doctorsTableBody').innerHTML = `<tr><td colspan="5" class="text-center text-danger">Failed to load doctors</td></tr>`;
    }
}

function openEditModal(doctor) {
    document.getElementById('editDoctorId').value = doctor.id;
    document.getElementById('editDocName').value = doctor.name;
    document.getElementById('editDocSpec').value = doctor.specialization;
    document.getElementById('editDocSchedule').value = doctor.schedule || '';
    const modal = new bootstrap.Modal(document.getElementById('editDoctorModal'));
    modal.show();
}

async function deleteDoctor(id) {
    if(!confirm('Are you sure you want to delete this doctor?')) return;
    try {
        await apiFetch(`/doctors/${id}`, { method: 'DELETE' });
        loadDoctors();
    } catch (e) {
        alert('Delete failed: You do not have permission.');
    }
}

function logout() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    window.location.href = '/';
}
