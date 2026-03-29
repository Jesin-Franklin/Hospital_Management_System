document.addEventListener('DOMContentLoaded', async () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
        window.location.href = '/';
        return;
    }
    const user = JSON.parse(userStr);
    document.getElementById('userNameDisplay').textContent = `${user.username} (${user.role})`;

    await loadBills();

    document.getElementById('generateBillForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const patient = { id: parseInt(document.getElementById('billPatientId').value) };
        const consultationFee = parseFloat(document.getElementById('billConsult').value);
        const medicineFee = parseFloat(document.getElementById('billMeds').value);
        const testFee = parseFloat(document.getElementById('billTest').value);

        try {
            await apiFetch(`/bills`, {
                method: 'POST',
                body: JSON.stringify({ patient, consultationFee, medicineFee, testFee, isPaid: false })
            });
            const modal = bootstrap.Modal.getInstance(document.getElementById('generateBillModal'));
            modal.hide();
            loadBills(); 
        } catch (err) {
            alert('Failed to create bill: ' + err.message);
        }
    });
});

async function loadBills() {
    try {
        const apps = await apiFetch('/bills');
        const tbody = document.getElementById('billingTableBody');
        tbody.innerHTML = '';
        
        apps.forEach(b => {
            let statusBadge = "bg-warning";
            const dateStr = b.billDate ? new Date(b.billDate).toLocaleString() : '';
            if(b.isPaid) statusBadge = "bg-success";

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${b.id}</td>
                <td>${dateStr}</td>
                <td>${b.patient ? b.patient.id : 'N/A'}</td>
                <td>$${b.totalAmount.toFixed(2)}</td>
                <td><span class="badge ${statusBadge}">${b.isPaid ? 'Paid' : 'Pending'}</span></td>
                <td>
                    ${!b.isPaid ? `<button class="btn btn-sm btn-outline-success" onclick="payBill(${b.id})">Mark Paid</button>` : ''}
                    <button class="btn btn-sm btn-outline-info" onclick="downloadPdf(${b.id})">Download PDF</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        document.getElementById('billingTableBody').innerHTML = `<tr><td colspan="6" class="text-center text-danger">Failed to load or access forbidden</td></tr>`;
    }
}

async function payBill(id) {
    if(!confirm('Are you confirm to mark this bill as Paid?')) return;
    try {
        await apiFetch(`/bills/${id}/pay`, { method: 'PUT' });
        loadBills();
    } catch(err) {
        alert("Failed to pay bill: " + err.message);
    }
}

function downloadPdf(id) {
    downloadFile(`/bills/${id}/pdf`, `Invoice-${id}.pdf`);
}

function logout() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    window.location.href = '/';
}
