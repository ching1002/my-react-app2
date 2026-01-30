import React from 'react';

const ContactList = ({ contacts, onEdit, onDelete }) => {
    return (
        <div className="space-y-4 pb-20">
            {contacts.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-slate-500 dark:text-slate-400 text-lg">
                        尚無聯絡人，請點擊右下角按鈕新增。
                    </p>
                </div>
            ) : (
                contacts.map((contact) => (
                    <div
                        key={contact.id}
                        className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/30">
                                {contact.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                                    {contact.name}
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-1">
                                    <span>{contact.company || '未填寫公司'}</span>
                                    <span className="text-slate-300">•</span>
                                    <span>{contact.phone}</span>
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => onEdit(contact)}
                                className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-full transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => onDelete(contact.id)}
                                className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-full transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default ContactList;
