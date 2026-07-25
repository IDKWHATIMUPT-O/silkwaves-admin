import { useEffect, useState } from 'react';
import Modal from '../components/ui/Modal.jsx';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from '../services/employeesApi.js';

const SECTIONS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'orders', label: 'Orders' },
  { id: 'fulfillment', label: 'Fulfillment' },
  { id: 'products', label: 'Products' },
  { id: 'customers', label: 'Customers' },
  { id: 'settings', label: 'Settings' },
  { id: 'reports', label: 'Reports' },
];

function emptyPermissions() {
  const perms = {};
  SECTIONS.forEach((s) => {
    perms[s.id] = { view: false, edit: false };
  });
  return perms;
}

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', permissions: emptyPermissions() });
  const [error, setError] = useState('');

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await getEmployees();
      setEmployees(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  function startAdd() {
    setForm({ name: '', email: '', password: '', permissions: emptyPermissions() });
    setEditingId(null);
    setShowForm(true);
    setError('');
  }

  function startEdit(employee) {
    setForm({
      name: employee.name,
      email: employee.email,
      password: '',
      permissions: { ...emptyPermissions(), ...employee.permissions },
    });
    setEditingId(employee._id);
    setShowForm(true);
    setError('');
  }

  function togglePermission(section, level) {
    setForm((current) => ({
      ...current,
      permissions: {
        ...current.permissions,
        [section]: {
          ...current.permissions[section],
          [level]: !current.permissions[section][level],
        },
      },
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    try {
      if (editingId) {
        const payload = { name: form.name, permissions: form.permissions };
        if (form.password) payload.password = form.password;
        await updateEmployee(editingId, payload);
      } else {
        await createEmployee(form);
      }

      setShowForm(false);
      setEditingId(null);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Remove this employee account?')) return;

    try {
      await deleteEmployee(id);
      load();
    } catch (err) {
      alert(err.message);
    }
  }

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div>
      <span className="eyebrow">STAFF MANAGEMENT</span>
      <h1>Employees</h1>

      <button onClick={startAdd} style={{ marginBottom: '20px' }}>
        Add Employee
      </button>

      <div className="table-shell">
        <table className="product-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Access</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee._id}>
                <td>
                  <strong>{employee.name}</strong>
                </td>
                <td>{employee.email}</td>
                <td>
                  {SECTIONS.filter((s) => employee.permissions?.[s.id]?.view)
                    .map((s) => s.label)
                    .join(', ') || 'None'}
                </td>
                <td>
                  <div className="table-actions">
                    <button onClick={() => startEdit(employee)}>Edit</button>
                    <button onClick={() => handleDelete(employee._id)}>Remove</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={editingId ? 'Edit Employee' : 'Add Employee'}
      >
        <form onSubmit={handleSubmit}>
          {error && <p style={{ color: 'red' }}>{error}</p>}

          <div style={{ display: 'grid', gap: '10px', marginBottom: '16px' }}>
            <input
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))}
              required
            />
            <input
              placeholder="Login Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))}
              required
              disabled={!!editingId}
            />
            <input
              placeholder={editingId ? 'New Password (leave blank to keep current)' : 'Password'}
              type="text"
              value={form.password}
              onChange={(e) => setForm((current) => ({ ...current, password: e.target.value }))}
              required={!editingId}
            />
          </div>

          <h3>Access</h3>
          <table className="product-table">
            <thead>
              <tr>
                <th>Section</th>
                <th>View</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {SECTIONS.map((section) => (
                <tr key={section.id}>
                  <td>{section.label}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={form.permissions[section.id].view}
                      onChange={() => togglePermission(section.id, 'view')}
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={form.permissions[section.id].edit}
                      onChange={() => togglePermission(section.id, 'edit')}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            <button type="submit">{editingId ? 'Save Changes' : 'Create Employee'}</button>
            <button type="button" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
