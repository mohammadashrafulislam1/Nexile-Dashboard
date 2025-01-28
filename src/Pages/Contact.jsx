import axios from "axios";
import { useEffect, useState } from "react";
import { endPoint } from "../Components/ForAll/ForAll";

const Contact = () => {
    const [contacts, setContacts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedMessages, setExpandedMessages] = useState({});

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const response = await axios.get(`${endPoint}/contact`);
            setContacts(response?.data);
        } catch (error) {
            console.error("Error fetching contacts:", error);
        }
    };

    const deleteContact = async (id) => {
        try {
            await axios.delete(`${endPoint}/contact/${id}`);
            setContacts((prevContacts) => prevContacts.filter((contact) => contact._id !== id));
        } catch (error) {
            console.error("Error deleting contact:", error);
        }
    };

    const truncateMessage = (message, limit) => {
        if (message.length <= limit) return message;
        return `${message.substring(0, limit)}...`;
    };

    const toggleMessageExpansion = (id) => {
        setExpandedMessages((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const filteredContacts = contacts.filter((contact) =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 overflow-hidden">
            <h1 className="md:text-3xl text-xl font-semibold mb-4 text-center">Manage Contacts</h1>

            {/* Search Input */}
            <div className="flex justify-center items-center">
                <input
                    type="text"
                    placeholder="Search contacts..."
                    className="mb-4 p-2 lg:w-1/3 md:w-1/2 w-3/4 border border-gray-300 rounded shadow"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="overflow-x-auto mr-3 !rounded-[15px]">
                <table className="min-w-full bg-white border-gray-200 !rounded-[15px]">
                    <thead>
                        <tr className="bg-black text-white">
                            <th className="py-3 px-6 text-left text-xs font-semibold uppercase tracking-wider">Name</th>
                            <th className="py-3 px-6 text-left text-xs font-semibold uppercase tracking-wider">Email</th>
                            <th className="py-3 px-6 text-left text-xs font-semibold uppercase tracking-wider">Phone</th>
                            <th className="py-3 px-6 text-left text-xs font-semibold uppercase tracking-wider">Service</th>
                            <th className="py-3 px-6 text-left text-xs font-semibold uppercase tracking-wider">Subject</th>
                            <th className="py-3 px-6 text-left text-xs font-semibold uppercase tracking-wider">Message</th>
                            <th className="py-3 px-6 text-left text-xs font-semibold uppercase tracking-wider">Website</th>
                            <th className="py-3 px-6 text-left text-xs font-semibold uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="!rounded-xl">
                        {filteredContacts.map((contact) => (
                            <tr key={contact._id} className="border-t border-gray-200 hover:bg-gray-900 hover:text-white">
                                <td className="py-3 px-6 text-sm font-medium">{contact.name}</td>
                                <td className="py-3 px-6 text-sm">
                                    <a href={`mailto:${contact.email}`} className="text-blue-500 underline">
                                        {contact.email}
                                    </a>
                                </td>
                                <td className="py-3 px-6 text-sm">{contact.phone}</td>
                                <td className="py-3 px-6 text-sm">{contact.service}</td>
                                <td className="py-3 px-6 text-sm">{contact.subject}</td>
                                <td className="py-3 px-6 text-sm">
                                    {expandedMessages[contact._id] ? (
                                        <>
                                            {contact.message} <br />
                                            <button
                                                onClick={() => toggleMessageExpansion(contact._id)}
                                                className="text-blue-500 underline"
                                            >
                                                See Less
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            {truncateMessage(contact.message, 50)} <br />
                                            <button
                                                onClick={() => toggleMessageExpansion(contact._id)}
                                                className="text-blue-500 underline"
                                            >
                                                See More
                                            </button>
                                        </>
                                    )}
                                </td>
                                <td className="py-3 px-6 text-sm">
                                    <a href={`https://${contact.web}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                        {contact.web}
                                    </a>
                                </td>
                                <td className="py-3 px-6 text-center">
                                    <button
                                        onClick={() => deleteContact(contact._id)}
                                        className="text-white bg-red-500 px-2 py-1 rounded hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Contact;
