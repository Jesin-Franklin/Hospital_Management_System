document.addEventListener('DOMContentLoaded', async () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
        window.location.href = '/';
        return;
    }
    const user = JSON.parse(userStr);
    document.getElementById('userNameDisplay').textContent = `${user.username} (${user.role})`;

    await loadRecords();

    document.getElementById('addRecordForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const patient = { id: parseInt(document.getElementById('recPatientId').value) };
        const doctor = { id: parseInt(document.getElementById('recDoctorId').value) };
        const diagnosis = document.getElementById('recDiagnosis').value;
        const prescription = document.getElementById('recPrescription').value;

        try {
            await apiFetch(`/medical-records`, {
                method: 'POST',
                body: JSON.stringify({ patient, doctor, diagnosis, prescription })
            });
            const modal = bootstrap.Modal.getInstance(document.getElementById('addRecordModal'));
            modal.hide();
            loadRecords(); 
        } catch (err) {
            alert('Failed to add record: ' + err.message);
        }
    });
});

async function loadRecords() {
    try {
        const apps = await apiFetch('/medical-records');
        const tbody = document.getElementById('recordsTableBody');
        tbody.innerHTML = '';
        
        apps.forEach(r => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${r.id}</td>
                <td>${r.recordDate}</td>
                <td>${r.patient ? r.patient.id : 'N/A'}</td>
                <td>${r.doctor ? r.doctor.id : 'N/A'}</td>
                <td>${r.diagnosis}</td>
                <td>${r.prescription}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        document.getElementById('recordsTableBody').innerHTML = `<tr><td colspan="6" class="text-center text-danger">Failed to load or access forbidden</td></tr>`;
    }
}

function logout() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    window.location.href = '/';
}
