import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { endPoint } from '../Components/ForAll/ForAll'; // Make sure this path is correct
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaTrashAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const Founder = () => {
    const [formData, setFormData] = useState({
        title: '',
        des: '',
        year: '',
        satisfaction: '',
        completedPersonally: '',
        website: '',
        experience: '',
        founderName: '',
        founderImage: null,
    });

    const [founderImagePreview, setFounderImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedFounder, setSelectedFounder] = useState(null);

    useEffect(() => {
        const fetchFounder = async () => {
            try {
                const response = await axios.get(`${endPoint}/founder`);
                const data = response.data[0];
                if (data) {
                    setSelectedFounder(data);
                    console.log(data)
                    setFormData({
                        title: data.title,
                        des: data.des,
                        year: data.year,
                        satisfaction: data.satisfaction,
                        completedPersonally: data.completedPersonally,
                        website: data.website,
                        experience: data.experience,
                        founderName: data.founderName,
                        founderImage: null,
                    });
                    setFounderImagePreview(data.founderImage); // Set image preview
                }
                setLoading(false);
            } catch (error) {
                setError("Failed to load founder.");
                setLoading(false);
            }
        };
        fetchFounder()
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, founderImage: file });
        // Create a preview URL
        const previewUrl = URL.createObjectURL(file);
        setFounderImagePreview(previewUrl); // Update image preview state
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const form = new FormData();

        // Append other fields normally
        Object.keys(formData).forEach((key) => {
            form.append(key, formData[key]);
        });

        console.log()

        try {
            if (selectedFounder) {
                await axios.put(`${endPoint}/founder/${selectedFounder._id}`, form);
                toast.success("Founder updated successfully!");
            } else {
                await axios.post(`${endPoint}/founder`, form);
                toast.success("Founder added successfully!");
            }
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: `${selectedFounder? "Founder updated successfully!" :"Founder added successfully!" }`,
                showConfirmButton: false,
                timer: 1500
              });
            setFounderImagePreview(null); // Reset image preview
            setLoading(false);
            window.location.reload();
        } catch (error) {
            console.error(error.response.data);
            toast.error(error.response.data.error || "Failed to submit form.");
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${endPoint}/founder/${selectedFounder._id}`);
            toast.success("Founder deleted successfully!");
            window.location.reload();
        } catch (error) {
            toast.error("Failed to delete founder.");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-bars loading-lg"></span>
            </div>
        );
    }
    if (error) return <div>{error}</div>;

    return (
        <div className="p-8">
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
              Manage Founder
            </span>
          </li>
        </ul>
        <ToastContainer/>
      </div>
            <form onSubmit={handleSubmit} className="lg:w-1/2 md:w-[80%] w-[96%] mx-auto bg-white p-6 rounded-2xl shadow-md">
                <h4 className="text-xl font-semibold text-center mb-4">
                    {selectedFounder ? "Update Founder" : "Add Founder"}
                </h4>

                {/* Form Fields */}
                <div className="flex flex-col mb-4 mt-5">
                    <label className="mb-2">Founder Name</label>
                    <input
                        type="text"
                        name="founderName"
                        value={formData.founderName}
                        onChange={handleInputChange}
                        className="input input-bordered"
                        placeholder="Founder Name"
                    />
                </div>

                <div className="flex flex-col mb-4">
                    <label className="mb-2">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="input input-bordered"
                        placeholder="Title"
                    />
                </div>

                <div className="flex flex-col mb-4">
                    <label className="mb-2">Description</label>
                    <textarea
                        name="des"
                        value={formData.des}
                        onChange={handleInputChange}
                        className="textarea textarea-bordered"
                        placeholder="Description"
                    ></textarea>
                </div>

                <div className="flex flex-col mb-4">
                    <label className="mb-2">Year</label>
                    <input
                        type="text"
                        name="year"
                        value={formData.year}
                        onChange={handleInputChange}
                        className="input input-bordered"
                        placeholder="Year"
                    />
                </div>

                <div className="flex flex-col mb-4">
                    <label className="mb-2">Satisfaction</label>
                    <input
                        type="text"
                        name="satisfaction"
                        value={formData.satisfaction}
                        onChange={handleInputChange}
                        className="input input-bordered"
                        placeholder="Satisfaction"
                    />
                </div>

                <div className="flex flex-col mb-4">
                    <label className="mb-2">Completed Personally</label>
                    <input
                        type="text"
                        name="completedPersonally"
                        value={formData.completedPersonally}
                        onChange={handleInputChange}
                        className="input input-bordered"
                        placeholder="Completed Personally"
                    />
                </div>

                <div className="flex flex-col mb-4">
                    <label className="mb-2">Website</label>
                    <input
                        type="text"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        className="input input-bordered"
                        placeholder="Website"
                    />
                </div>

                <div className="flex flex-col mb-4">
                    <label className="mb-2">Experience</label>
                    <input
                        type="text"
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        className="input input-bordered"
                        placeholder="Experience"
                    />
                </div>

                <div className="flex flex-col mb-4">
                    <label className="mb-2">Founder Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="file-input input-bordered"
                    />
                    {founderImagePreview && (
                        <img
                            src={founderImagePreview}
                            alt="Founder Preview"
                            className="mt-4 h-20 object-contain"
                        />
                    )}
                </div>

                <button
                    type="submit"
                    className={`btn w-full bg-black text-white btn-sm mt-4`}
                >
                    {selectedFounder ? "Update" : "Add"}
                </button>
            </form>

            {selectedFounder && (
                <button
                    className="btn btn-sm bg-red-600 text-white w-[30%] mx-auto flex justify-center mt-4"
                    onClick={handleDelete}
                >
                    Delete Founder
                </button>
            )}
        </div>
    );
};

export default Founder;
