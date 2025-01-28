import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { endPoint } from '../Components/ForAll/ForAll'; // Adjust the import path as necessary
import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';
import { FaTrashAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
    const [footerData, setFooterData] = useState({
        company:[ { name: '', link: '' }],
        logo: '',
        services: [{ name: '', link: '' }],
        resources: [{ name: '', link: '' }],
        followUs: [{ platform: '', url: '' }],
        contactMessage: '',
        copyright: {
            message: 'All rights reserved',
            company: 'Nexile Digital',
        },
    });
    const [loading, setLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [footerId, setFooterId] = useState(null);
    const [logoFile, setLogoFile] = useState(null);

    // Fetch existing footer data if needed for edit mode
    useEffect(() => {
        fetchFooterData();
    }, []);

    const fetchFooterData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${endPoint}/footer`);
            console.log(response.data.footer[0])
            if (response.data.footer.length > 0) {
                const existingFooter = response.data.footer[0];
                setFooterData(existingFooter);
                setFooterId(existingFooter._id);
                setIsUpdating(true);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching footer data:', error);
            setLoading(false);
        }
    };

    const handleCompanyChange = (index, e) => {
        const { name, value } = e.target;
        const updatedCompany = footerData.company.map((comp, i) =>
            i === index ? { ...comp, [name]: value } : comp
        );
        setFooterData((prevData) => ({ ...prevData, company: updatedCompany }));
    };

    const addCompanyField = () => {
        setFooterData((prevData) => ({
            ...prevData,
            company: [...prevData.company, { name: '', link: '' }],
        }));
    };

    const deleteCompanyField = (index) => {
        setFooterData((prevData) => ({
            ...prevData,
            company: prevData.company.filter((_, i) => i !== index),
        }));
    };

    const handleFooterChange = (e) => {
        const { name, value } = e.target;
        setFooterData((prevData) => ({
            ...prevData,
            company: { ...prevData.company, [name]: value }, // Handle company name and link
        }));
    };

    const handleServiceChange = (index, e) => {
        const { name, value } = e.target;
        const updatedServices = footerData.services.map((service, i) =>
            i === index ? { ...service, [name]: value } : service
        );
        setFooterData((prevData) => ({ ...prevData, services: updatedServices }));
    };

    const handleResourceChange = (index, e) => {
        const { name, value } = e.target;
        const updatedResources = footerData.resources.map((resource, i) =>
            i === index ? { ...resource, [name]: value } : resource
        );
        setFooterData((prevData) => ({ ...prevData, resources: updatedResources }));
    };

    const handleFollowUsChange = (index, e) => {
        const { name, value } = e.target;
        const updatedFollowUs = footerData.followUs.map((social, i) =>
            i === index ? { ...social, [name]: value } : social
        );
        setFooterData((prevData) => ({ ...prevData, followUs: updatedFollowUs }));
    };

    const addServiceField = () => {
        setFooterData((prevData) => ({
            ...prevData,
            services: [...prevData.services, { name: '', link: '' }],
        }));
    };

    const addResourceField = () => {
        setFooterData((prevData) => ({
            ...prevData,
            resources: [...prevData.resources, { name: '', link: '' }],
        }));
    };

    const addFollowUsField = () => {
        setFooterData((prevData) => ({
            ...prevData,
            followUs: [...prevData.followUs, { platform: '', url: '' }],
        }));
    };

    const deleteServiceField = (index) => {
        setFooterData((prevData) => ({
            ...prevData,
            services: prevData.services.filter((_, i) => i !== index),
        }));
    };

    const deleteResourceField = (index) => {
        setFooterData((prevData) => ({
            ...prevData,
            resources: prevData.resources.filter((_, i) => i !== index),
        }));
    };

    const deleteFollowUsField = (index) => {
        setFooterData((prevData) => ({
            ...prevData,
            followUs: prevData.followUs.filter((_, i) => i !== index),
        }));
    };
    const handleLogoChange = (e) => {
        setLogoFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        
        // Append text fields
        formData.append('footerData', JSON.stringify(footerData));
        if (logoFile) formData.append('logo', logoFile); // Add logo file if present

        // Log formData contents
for (const [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
}
    
        try {
            const response = isUpdating
                ? await axios.put(`${endPoint}/footer/${footerId}`, formData)
                : await axios.post(`${endPoint}/footer`, formData);
                
                window.location.reload();// Refresh the footer list
            
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: `${isUpdating ? 'Footer updated successfully!' : 'Footer added successfully!'}`,
                showConfirmButton: false,
                timer: 1500,
            });
            toast.success(response.data.message);
            setLoading(false);
        } catch (error) {
            console.error('Error saving footer data:', error);
            toast.error('Error saving footer data');
            setLoading(false);
        }
    };
    const handleDelete = async(id)=>{
        console.log(id)
        const confirmDelete = await Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        if (confirmDelete.isConfirmed) {
            try {
                await axios.delete(`${endPoint}/footer/${id}`);
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Footer deleted successfully!",
                    showConfirmButton: false,
                    timer: 1500,
                });
                window.location.reload();// Refresh the footer list
            } catch (error) {
                console.error("Error deleting Footer:", error);
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong while deleting the Footer!",
                });
            }
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-bars loading-lg"></span>
            </div>
        );
    }

    return (
        <div className='my-10'>
             <div className="breadcrumbs text-sm lg:w-1/2 md:w-[80%] w-[90%] mx-auto">
                <ul className="my-6">
                    <li>
                        <Link to="/" className="inline-flex items-center gap-2">
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
                        <span className="inline-flex items-center gap-2">
                            <svg
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
                           Footer
                        </span>
                    </li>
                </ul>
                <ToastContainer />
            </div>
            <ToastContainer />
            {
                footerId && 
            <button className='btn btn-sm bg-red-500 mx-auto text-white flex justify-center mb-5' onClick={()=>handleDelete(footerId && footerId)}>delete</button>
            }
            <form onSubmit={handleSubmit} className="p-6 lg:w-1/2 md:w-[80%] w-[90%] mx-auto bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-center">{isUpdating ? 'Update' : 'Add'} Footer</h2>
            <div>
            <h3 className="text-lg font-semibold mb-2">Company:</h3>
            {footerData?.company?.map((comp, index) => (
                <div key={index} className="dynamic-field flex justify-betweeen gap-5">
                    <input
                        type="text"
                        name="name"
                        placeholder="Company Name"
                        className="input input-bordered w-full mb-2"
                        value={comp.name}
                        onChange={(e) => handleCompanyChange(index, e)}
                    />
                    <input
                        type="text"
                        name="link"
                        placeholder="Company Link"
                        className="input input-bordered w-full mb-2"
                        value={comp.link}
                        onChange={(e) => handleCompanyChange(index, e)}
                    />
                    <button onClick={() => deleteCompanyField(index)} className='w-[15%] text-2xl text-red-600'><FaTrashAlt /></button>
                </div>
            ))}
            <button type='button' onClick={addCompanyField} className="text-5xl text-black mb-2">+</button>
            </div>

            <div className="mb-4">
            <label className="label">
                <span className="label-text">Logo:</span>
            </label>
            <input
                type="file"
                name="logo"
                onChange={handleLogoChange}
                className="file-input file-input-bordered w-full"
            />
           {logoFile ? (
                <img
                    src={URL.createObjectURL(logoFile)}
                    alt="Logo Preview"
                    className="mt-2 h-32 w-32 rounded-xl object-cover"
                />
            ) : (
                footerData?.logo && (
                    <img
                        src={footerData.logo}
                        alt="Logo Preview"
                        className="mt-2 h-32 w-32 rounded-xl"
                    />
                )
            )}
        </div>
                <div>
                    <h3 className="text-lg font-semibold mb-2">Services:</h3>
                    {footerData.services.map((service, index) => (
                        <div key={index} className="flex items-center gap-2 mb-2">
                            <input
                                type="text"
                                name="name"
                                value={service.name}
                                onChange={(e) => handleServiceChange(index, e)}
                                className="input input-bordered w-full mb-2"
                                placeholder="Service Name"
                                required
                            />
                            <input
                                type="text"
                                name="link"
                                value={service.link}
                                onChange={(e) => handleServiceChange(index, e)}
                                className="input input-bordered w-full mb-2"
                                placeholder="Service Link"
                            />
                            <button
                                type="button"
                                onClick={() => deleteServiceField(index)}
                                className="text-red-600"
                            >
                                <FaTrashAlt />
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={addServiceField} className="text-5xl text-black mb-2">+</button>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-2">Resources:</h3>
                    {footerData.resources.map((resource, index) => (
                        <div key={index} className="flex items-center gap-2 mb-2">
                            <input
                                type="text"
                                name="name"
                                value={resource.name}
                                onChange={(e) => handleResourceChange(index, e)}
                                className="input input-bordered w-full mb-2"
                                placeholder="Resource Name"
                                required
                            />
                            <input
                                type="text"
                                name="link"
                                value={resource.link}
                                onChange={(e) => handleResourceChange(index, e)}
                                className="input input-bordered w-full mb-2"
                                placeholder="Resource Link"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => deleteResourceField(index)}
                                className="text-red-600"
                            >
                                <FaTrashAlt />
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={addResourceField} className="text-5xl text-black mb-2">+</button>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-2">Follow Us:</h3>
                    {footerData.followUs.map((social, index) => (
                        <div key={index} className="flex items-center gap-2 mb-2">
                            <input
                                type="text"
                                name="platform"
                                value={social.platform}
                                onChange={(e) => handleFollowUsChange(index, e)}
                                className="input input-bordered w-full mb-2"
                                placeholder="Platform Name"
                                required
                            />
                            <input
                                type="text"
                                name="url"
                                value={social.url}
                                onChange={(e) => handleFollowUsChange(index, e)}
                                className="input input-bordered w-full mb-2"
                                placeholder="Platform URL"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => deleteFollowUsField(index)}
                                className="text-red-600"
                            >
                                <FaTrashAlt />
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={addFollowUsField} className="text-5xl text-black mb-4">+</button>
                </div>

                <div className="mb-4">
                    <label className="label">
                        <span className="label-text">Contact Message:</span>
                    </label>
                    <textarea
                        name="contactMessage"
                        value={footerData.contactMessage}
                        onChange={(e) => setFooterData({ ...footerData, contactMessage: e.target.value })}
                        className="textarea textarea-bordered w-full"
                        rows="1"
                    />
                </div>

                <div className="mb-4">
                    <label className="label">
                        <span className="label-text">Copyright Message:</span>
                    </label>
                    <input
                        type="text"
                        name="message"
                        value={footerData.copyright.message}
                        onChange={(e) => setFooterData({ ...footerData, copyright: { ...footerData.copyright, message: e.target.value } })}
                        className="input input-bordered w-full"
                    />
                </div>

                <div className="mb-4">
                    <label className="label">
                        <span className="label-text">Copyright Company:</span>
                    </label>
                    <input
                        type="text"
                        name="company"
                        value={footerData.copyright.company}
                        onChange={(e) => setFooterData({ ...footerData, copyright: { ...footerData.copyright, company: e.target.value } })}
                        className="input input-bordered w-full"
                    />
                </div>

                <button type="submit" className="btn btn-sm bg-black text-white w-full mt-4" disabled={loading}>
    {loading ? 'Saving...' : isUpdating ? 'Update Footer' : 'Add Footer'}
</button>

            </form>
        </div>
    );
};

export default Footer;
