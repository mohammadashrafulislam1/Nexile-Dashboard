import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { endPoint } from '../Components/ForAll/ForAll';
import { Link } from 'react-router-dom';
import { BsPencilSquare } from 'react-icons/bs';
import { FaTrashAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';

const Clients = () => {
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        email: '',
        phone: '',
        image: null,
    });
  const [loading, setLoading] = useState(false);
  const [clientImage, setClientImage] = useState(null);


    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`${endPoint}/client`);
            setClients(response.data);
            setLoading(false)
        } catch (error) {
            toast.error('Error fetching clients');
            setLoading(false)
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
        
        const previewUrl = URL.createObjectURL(e.target.files[0]);
        setClientImage(previewUrl);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
            formDataToSend.append(key, formData[key]);
        });
        try {
            if (selectedClient) {
                // Update client
                console.log("client")
                await axios.put(`${endPoint}/client/${selectedClient._id}`, formDataToSend);
                toast.success('Client updated successfully');
                setLoading(false)
            } else {
                // Add new client
                console.log("client")
                await axios.post(`${endPoint}/client`, formDataToSend);
                toast.success('Client added successfully');
                setLoading(false)
            }
            fetchClients(); // Refresh the client list
            setFormData({ name: '', description: '', email: '', phone: '', image: null });
            setClientImage(null)
            setSelectedClient(null);
        } catch (error) {
            console.log(error)
            toast.error('Error saving client');
            setLoading(false)
        }
        finally{
            setLoading(false)
        }
    };

    const handleEditClient = (client) => {
        setSelectedClient(client);
        setFormData({
            name: client.name,
            description: client.description,
            email: client.email,
            phone: client.phone,
            image: null,
        });
    };

    const handleDeleteClient = async (cleint) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `You are about to delete the service: ${cleint.name}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
          });
          
    if (result.isConfirmed) {
        try {
            await axios.delete(`${endPoint}/client/${cleint._id}`);
            toast.success('Client deleted successfully');
            fetchClients(); // Refresh the client list
        } catch (error) {
            console.log(error)
            toast.error('Error deleting client');
        }}
    };

    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <span className="loading loading-bars loading-lg"></span>
        </div>
      );
    }
  

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4 text-center">{selectedClient ? 'Update Client' : 'Add Client'}</h2>
            <div className="breadcrumbs text-sm lg:w-1/2 md:w-[80%] w-[96%] mx-auto">
        <ul className="my-6">
          <li>
            <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:underline">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="h-4 w-4 stroke-current">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
              </svg>
              Home
            </Link>
          </li>
          <li>
            <span className="inline-flex items-center gap-2 text-gray-700"><svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="h-4 w-4 stroke-current">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
             Clients</span>
          </li>
        </ul>
        <ToastContainer />
      </div>
            <form onSubmit={handleSubmit} className="mb-6 lg:w-1/2 md:w-[80%] w-[96%] mx-auto bg-white p-6 rounded-2xl shadow-md">
                <div className="mb-4">
                    <label className="block text-gray-700">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="input input-bordered w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="textarea textarea-bordered w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="input input-bordered w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Phone</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="input input-bordered w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Image</label>
                    <input
                        type="file"
                        className="file-input w-full"
                        onChange={handleFileChange}
                    />
                    {
                    clientImage ? <img src={clientImage} alt=""  className="w-24 h-24 rounded-md object-cover my-3"/> :
                  <img src={selectedClient?.image} alt={selectedClient?.title} className="w-24 h-24 rounded-md object-cover my-3" />
                
                  }
                </div>
                <button type="submit" className="btn btn-md bg-black text-white w-full">
                    {selectedClient ? 'Update Client' : 'Add Client'}
                </button>
            </form>

            <div className='mx-auto'>
            <h2 className="text-xl font-bold">Clients List</h2>
            <div className="mt-6 flex flex-warp gap-4">
                {clients?.map((client) => (
                    <div key={client._id} className="p-4 border rounded-md bg-white flex gap-3 justify-center items-center">
                        <div className="flex gap-3 items-center">
                        <img src={client.image} alt={client.name} className="w-32 h-32 rounded-md object-cover my-3" /></div>
                        <div><h3 className="text-lg font-bold">{client.name}</h3>
                        <p>{client.description}</p>
                        <p>Email: {client.email}</p>
                        <p>Phone: {client.phone}</p></div>
                        <div className="flex gap-3 items-center">
                        <button className="text-2xl text-blue-600 " onClick={() => handleEditClient(client)}> <BsPencilSquare /></button>
                        <button  className="text-2xl text-red-600" onClick={() => handleDeleteClient(client)}><FaTrashAlt /></button>
                        </div>
                    </div>
                ))}
            </div>
            </div>
        </div>
    );
};

export default Clients;
