import React, { useState, useEffect } from 'react';
import ContactList from './components/ContactList';
import ContactForm from './components/ContactForm';
import { initDB, getContacts, createContact, updateContact, deleteContact } from './database/sqlite';
import { Capacitor } from '@capacitor/core';

function App() {
  const [contacts, setContacts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const data = await getContacts();
      setContacts(data || []);
    } catch (error) {
      console.error("Error loading contacts:", error);
      // Fallback for non-supported web env without jeep-sqlite
      if (!Capacitor.isNativePlatform()) {
        console.log("Mock data for web");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        await initDB();
        await loadData();
      } catch (e) {
        console.error("DB Init Failed", e);
      }
    };
    init();
  }, []);

  const handleCreate = async (data) => {
    try {
      await createContact(data);
      await loadData();
      setShowForm(false);
    } catch (error) {
      console.error("Error creating contact:", error);
    }
  };

  const handleUpdate = async (data) => {
    try {
      await updateContact({ ...data, id: editingContact.id });
      await loadData();
      setShowForm(false);
      setEditingContact(null);
    } catch (error) {
      console.error("Error updating contact:", error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('確定要刪除這位聯絡人嗎？')) {
      try {
        await deleteContact(id);
        await loadData();
      } catch (error) {
        console.error("Error deleting contact:", error);
      }
    }
  };

  const openAddForm = () => {
    setEditingContact(null);
    setShowForm(true);
  };

  const openEditForm = (contact) => {
    setEditingContact(contact);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-sans transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-10 px-4 py-4 backdrop-blur-md bg-opacity-80 dark:bg-opacity-80 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            聯絡簿
          </h1>
          <div className="text-sm text-slate-500">
            {contacts.length} 位聯絡人
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-xl mx-auto p-4">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <ContactList
            contacts={contacts}
            onEdit={openEditForm}
            onDelete={handleDelete}
          />
        )}
      </main>

      {/* Floating Action Button */}
      <button
        onClick={openAddForm}
        className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg shadow-indigo-600/40 flex items-center justify-center text-3xl transition-transform active:scale-95"
      >
        +
      </button>

      {/* Modal Form */}
      {showForm && (
        <ContactForm
          initialData={editingContact}
          onSubmit={editingContact ? handleUpdate : handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

export default App;
