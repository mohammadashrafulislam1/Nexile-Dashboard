import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { endPoint } from '../Components/ForAll/ForAll';
import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';
import { FaTrashAlt } from 'react-icons/fa';

const Faq = () => {
    const [section, setSection] = useState({
        sectionTitle: '',
        sectionDescription: '',
        metaTitle: '',
        metaDescription: '',
        faqs: [{ title: '', description: '' }],
    });
  const [loading, setLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
    const [sectionId, setSectionId] = useState(null);

    // Fetch existing FAQ section if needed for edit mode
    useEffect(() => {
        fetchFaqSection();
    }, []);
    const fetchFaqSection = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${endPoint}/faq`);
            if (response.data.length > 0) {
                const existingSection = response.data[0];
                setSection(existingSection);
                setSectionId(existingSection._id);
                setIsUpdating(true);
            setLoading(false)
                
            }
        } catch (error) {
            console.error('Error fetching FAQ section:', error);
        }
    };


    const handleSectionChange = (e) => {
        const { name, value } = e.target;
        setSection((prevSection) => ({
            ...prevSection,
            [name]: value,
        }));
    };

    const handleFaqChange = (index, e) => {
        const { name, value } = e.target;
        const updatedFaqs = section.faqs.map((faq, i) =>
            i === index ? { ...faq, [name]: value } : faq
        );
        setSection((prevSection) => ({ ...prevSection, faqs: updatedFaqs }));
    };

    const addFaqField = () => {
        setSection((prevSection) => ({
            ...prevSection,
            faqs: [...prevSection.faqs, { title: '', description: '' }],
        }));
    };


    const deleteFaqField = async (faqId, index) => {
        console.log(faqId)
        setLoading(true)
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: `You are about to delete the Faq`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!',
              });
            
              if (result.isConfirmed) {
            if(sectionId){
                await axios.delete(`${endPoint}/faq/${sectionId}/${faqId}`);
            setSection((prevSection) => ({
                ...prevSection,
                faqs: prevSection.faqs.filter((faq) => faq._id !== faqId),
            }));
            setLoading(false)
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "FAQ deleted successfully!",
                showConfirmButton: false,
                timer: 1500,
            });
        fetchFaqSection();
            }
            else{
                const updatedFaqs = section.faqs.filter((_, i) => i !== index);
                setSection((prevSection) => ({ ...prevSection, faqs: updatedFaqs }));
            setLoading(false)
                
            } }
        } catch (error) {
            console.error('Error deleting FAQ:', error);
            setLoading(false)
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to delete FAQ",
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
     console.log(section)
            if (isUpdating) {
                await axios.put(`${endPoint}/faq/${sectionId}`, section);
            setLoading(false)
            } else {
                const response = await axios.post(`${endPoint}/faq`, section);
                setSectionId(response.data.data._id);
                setIsUpdating(true);
            setLoading(false)

            }
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: `${isUpdating ? "Faq updated successfully!":"Faq added successfully!"}`,
                showConfirmButton: false,
                timer: 1500,
              });
        } catch (error) {
            setLoading(false)
            console.error('Error saving FAQ section:', error);
            toast.error("Error saving FAQ section")
        }
    };
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
            <ToastContainer />
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
             Faqs
            </span>
          </li>
        </ul>
      </div>
           <form onSubmit={handleSubmit} className="p-6 lg:w-1/2 md:w-[80%] w-[90%] mx-auto bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">{isUpdating ? 'Update' : 'Add'} FAQ Section</h2>
            <div className="mb-4">
                <label className="label">
                    <span className="label-text">Section Title:</span>
                </label>
                <input
                    type="text"
                    name="sectionTitle"
                    value={section.sectionTitle}
                    onChange={handleSectionChange}
                    className="input input-bordered w-full"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="label">
                    <span className="label-text">Section Description:</span>
                </label>
                <textarea
                    type="text"
                    name="sectionDescription"
                    value={section.sectionDescription}
                    onChange={handleSectionChange}
                    className="textarea textarea-bordered w-full"
                />
            </div>
            <div className="mb-4">
                <label className="label">
                    <span className="label-text">Meta Title:</span>
                </label>
                <input
                    type="text"
                    name="metaTitle"
                    value={section.metaTitle}
                    onChange={handleSectionChange}
                    className="input input-bordered w-full"
                />
            </div>
            <div className="mb-4">
                <label className="label">
                    <span className="label-text">Meta Description:</span>
                </label>
                <textarea
                    type="text"
                    name="metaDescription"
                    value={section.metaDescription}
                    onChange={handleSectionChange}
                    className="textarea textarea-bordered w-full"
                    rows={3}
                />
            </div>
            <div>
                <h3 className="text-lg font-semibold mb-2">FAQs:</h3>
                <div className='flex flex-col gap-5'>
                {section.faqs.map((faq, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2 bg-gray-100 p-8 rounded-xl">
                        <div className="flex-1">
                            <label className="label">
                                <span className="label-text">FAQ Title:</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={faq.title}
                                onChange={(e) => handleFaqChange(index, e)}
                                className="input input-bordered w-full mb-2"
                                required
                            />
                            <label className="label">
                                <span className="label-text">FAQ Description:</span>
                            </label>
                            <textarea
                                type="text"
                                name="description"
                                value={faq.description}
                                onChange={(e) => handleFaqChange(index, e)}
                                className="textarea textarea-bordered w-full"
                                required
                                rows={4}
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => deleteFaqField(faq._id, index)}
                            className="w-[10%] text-2xl text-red-600 flex justify-end"
                        >                  <FaTrashAlt />
                        </button>
                    </div>
                ))}
                </div>
                <button type="button" onClick={addFaqField} className="text-4xl text-black mt-2">
                 +
                </button>
            </div>
            <button type="submit" className="btn btn-sm bg-black text-white w-full mt-4">
                {isUpdating ? 'Update' : 'Add'} FAQ Section
            </button>
        </form>
     </div>
    );
};

export default Faq;
