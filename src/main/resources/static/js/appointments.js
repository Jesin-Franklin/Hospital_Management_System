document.addEventListener('DOMContentLoaded', async () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
        window.location.href = '/';
        return;
    }
    const user = JSON.parse(userStr);
    document.getElementById('userNameDisplay').textContent = `${user.username} (${user.role})`;

    await loadAppointments();

    document.getElementById('bookApptForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const patient = { id: parseInt(document.getElementById('apptPatientId').value) };
        const doctor = { id: parseInt(document.getElementById('apptDoctorId').value) };
        const appointmentDate = document.getElementById('apptDate').value;
        const reason = document.getElementById('apptReason').value;

        try {
            await apiFetch(`/appointments`, {
                method: 'POST',
                body: JSON.stringify({ patient, doctor, appointmentDate, reason })
            });
            const modal = bootstrap.Modal.getInstance(document.getElementById('bookAppointmentModal'));
            modal.hide();
            loadAppointments(); 
        } catch (err) {
            alert('Failed to book appointment: ' + err.message);
        }
    });
});

async function loadAppointments() {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        let endpoint = '/appointments'; // default for Admin/Receptionist
        
        // Let's attempt to fetch all, if fails it might be restricted. 
        // A better production system knows IDs. Here we just fetch all assuming Admin for simplicity, 
        // or we can catch and show specific.
        const apps = await apiFetch(endpoint);
        const tbody = document.getElementById('appointmentsTableBody');
        tbody.innerHTML = '';
        
        apps.forEach(a => {
            const dateStr = new Date(a.appointmentDate).toLocaleString();
            let statusBadge = "bg-warning";
            if(a.status === "COMPLETED") statusBadge = "bg-success";
            if(a.status === "CANCELLED") statusBadge = "bg-danger";

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${a.id}</td>
                <td>${a.patient ? a.patient.name : 'Unknown'}</td>
                <td>Dr. ${a.doctor ? a.doctor.name : 'Unknown'}</td>
                <td>${dateStr}</td>
                <td>${a.reason}</td>
                <td><span class="badge ${statusBadge}">${a.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick='openStatusModal(${a.id}, "${a.status}")'>Update</button>
                    <button class="btn btn-sm btn-outline-danger" onclick="cancelAppointment(${a.id})">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        document.getElementById('appointmentsTableBody').innerHTML = `<tr><td colspan="7" class="text-center text-danger">Failed to load appointments (check permissions)</td></tr>`;
    }
}

function openStatusModal(id, currentStatus) {
    document.getElementById('statusApptId').value = id;
    document.getElementById('statusSelect').value = currentStatus;
    const modal = new bootstrap.Modal(document.getElementById('statusModal'));
    modal.show();
}

async function saveStatus() {
    const id = document.getElementById('statusApptId').value;
    const status = document.getElementById('statusSelect').value;
    try {
        await apiFetch(`/appointments/${id}/status?status=${status}`, { method: 'PUT' });
        const modal = bootstrap.Modal.getInstance(document.getElementById('statusModal'));
        modal.hide();
        loadAppointments();
    } catch(err) {
        alert("Failed to update status");
    }
}

async function cancelAppointment(id) {
    if(!confirm('Are you sure you want to delete this appointment?')) return;
    try {
        await apiFetch(`/appointments/${id}`, { method: 'DELETE' });
        loadAppointments();
    } catch (e) {
        alert('Delete failed: You do not have permission.');
    }
}

function logout() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    window.location.href = '/';
}
