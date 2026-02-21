'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'Super Admin' | 'Admin' | 'Editor' | 'Viewer';
    status: 'Active' | 'Inactive';
    lastLogin: string;
    initials: string;
}

const initialUsers: User[] = [
    { id: '1', name: 'Ahmed Davids', email: 'admin@saudiwood.com', role: 'Super Admin', status: 'Active', lastLogin: '2 mins ago', initials: 'AD' },
    { id: '2', name: 'Sara Al-Rashid', email: 'sara@saudiwood.com', role: 'Admin', status: 'Active', lastLogin: '1 hour ago', initials: 'SR' },
    { id: '3', name: 'Mohammed Ali', email: 'mohammed@saudiwood.com', role: 'Editor', status: 'Active', lastLogin: 'Yesterday', initials: 'MA' },
    { id: '4', name: 'Fatima Hassan', email: 'fatima@saudiwood.com', role: 'Viewer', status: 'Inactive', lastLogin: '2 weeks ago', initials: 'FH' },
];

const roleColors: Record<string, { bg: string; color: string }> = {
    'Super Admin': { bg: '#FFF3E0', color: '#E65100' },
    'Admin': { bg: '#E3F2FD', color: '#1565C0' },
    'Editor': { bg: '#E8F5E9', color: '#2E7D32' },
    'Viewer': { bg: '#F5F5F5', color: '#555' },
};

export default function UsersRolesPage() {
    const { locale } = useI18n();
    const [users, setUsers] = useState(initialUsers);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newRole, setNewRole] = useState<User['role']>('Viewer');

    const addUser = () => {
        if (!newName || !newEmail) return;
        const initials = newName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        const newUser: User = {
            id: String(users.length + 1), name: newName, email: newEmail,
            role: newRole, status: 'Active', lastLogin: 'Never', initials,
        };
        setUsers(prev => [...prev, newUser]);
        setShowAddModal(false);
        setNewName(''); setNewEmail('');
    };

    const updateRole = (id: string, role: User['role']) => {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
    };

    const toggleUserStatus = (id: string) => {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u));
    };

    return (
        <div style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1A1A1A', marginBottom: 4 }}>
                        {locale === 'ar' ? 'المستخدمون والأدوار' : 'Users & Roles'}
                    </h1>
                    <p style={{ fontSize: 13, color: '#888' }}>System › Users & Roles</p>
                </div>
                <button onClick={() => setShowAddModal(true)} style={{
                    padding: '10px 20px', borderRadius: 8, border: 'none',
                    background: '#1A1A1A', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                }}>+ Invite User</button>
            </div>

            {/* Add User Modal */}
            {showAddModal && (
                <div style={{
                    background: '#fff', borderRadius: 12, border: '1px solid #E8E8E4',
                    padding: 24, marginBottom: 20,
                }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#1A1A1A' }}>Invite New User</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 160px', gap: 12, marginBottom: 16 }}>
                        <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Full Name"
                            style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #E8E8E4', fontSize: 13, outline: 'none' }} />
                        <input value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="Email" type="email"
                            style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #E8E8E4', fontSize: 13, outline: 'none' }} />
                        <select value={newRole} onChange={e => setNewRole(e.target.value as User['role'])}
                            style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #E8E8E4', fontSize: 13, background: '#fff' }}>
                            <option>Viewer</option>
                            <option>Editor</option>
                            <option>Admin</option>
                            <option>Super Admin</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        <button onClick={() => setShowAddModal(false)} style={{
                            padding: '8px 16px', borderRadius: 6, fontSize: 13, border: '1px solid #E8E8E4', background: '#fff', cursor: 'pointer', color: '#555',
                        }}>Cancel</button>
                        <button onClick={addUser} style={{
                            padding: '8px 16px', borderRadius: 6, fontSize: 13, border: 'none', background: 'var(--gold)', color: '#fff', fontWeight: 600, cursor: 'pointer',
                        }}>Send Invitation</button>
                    </div>
                </div>
            )}

            {/* Users Table */}
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E8E8E4', overflow: 'hidden' }}>
                <div style={{
                    display: 'grid', gridTemplateColumns: '1fr 1fr 140px 100px 120px 80px',
                    padding: '12px 20px', borderBottom: '1px solid #E8E8E4',
                    fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5,
                }}>
                    <span>User</span>
                    <span>Email</span>
                    <span>Role</span>
                    <span>Status</span>
                    <span>Last Login</span>
                    <span>Actions</span>
                </div>
                {users.map(user => (
                    <div key={user.id} style={{
                        display: 'grid', gridTemplateColumns: '1fr 1fr 140px 100px 120px 80px',
                        padding: '14px 20px', borderBottom: '1px solid #F0F0EC', alignItems: 'center',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{
                                width: 36, height: 36, borderRadius: '50%', background: '#F0F0EC',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 12, fontWeight: 700, color: '#555',
                            }}>{user.initials}</div>
                            <span style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A' }}>{user.name}</span>
                        </div>
                        <span style={{ fontSize: 13, color: '#555' }}>{user.email}</span>
                        <select value={user.role} onChange={e => updateRole(user.id, e.target.value as User['role'])}
                            style={{
                                padding: '4px 8px', borderRadius: 20, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer',
                                background: roleColors[user.role].bg, color: roleColors[user.role].color,
                            }}>
                            <option>Super Admin</option>
                            <option>Admin</option>
                            <option>Editor</option>
                            <option>Viewer</option>
                        </select>
                        <button onClick={() => toggleUserStatus(user.id)} style={{
                            padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, border: 'none', cursor: 'pointer',
                            background: user.status === 'Active' ? '#E8F5E9' : '#F5F5F5',
                            color: user.status === 'Active' ? '#2E7D32' : '#999',
                        }}>{user.status}</button>
                        <span style={{ fontSize: 12, color: '#999' }}>{user.lastLogin}</span>
                        <button style={{ background: 'none', border: 'none', fontSize: 14, cursor: 'pointer' }}>⋮</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
