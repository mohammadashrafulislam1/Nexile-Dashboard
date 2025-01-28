import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { endPoint } from "../Components/ForAll/ForAll";
import { FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";

const AddTestimonial = () => {
    const {state} = useLocation();
    console.log(state?.testimonial)
    const selectedTestimonial = state?.testimonial;
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        testimonialText: '',
        clientName: '',
        clientDescription: '',
        rating: 5,
        socialLinks: [{ text: '', link: '' }],
        websiteOrVideoLink: '',
        clientImage: null,
    });
    const [clientImagePreview, setClientImagePreview] = useState(null);
    const [clientImageUpdate, setClientImageUpdate] = useState(null);

    useEffect(()=>{
        if(state?.testimonial){
            setFormData(state?.testimonial)
            setClientImageUpdate(state?.testimonial?.clientImage)
        }
    },[])
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        const formDataToSend = new FormData();
        formDataToSend.append("testimonialText", formData.testimonialText);
        formDataToSend.append("clientName", formData.clientName);
        formDataToSend.append("clientDescription", formData.clientDescription);
        formDataToSend.append("rating", formData.rating);
        formDataToSend.append("websiteOrVideoLink", formData.websiteOrVideoLink);
    
        formData.socialLinks.forEach((socialLink, index) => {
            formDataToSend.append(`socialLinks[${index}][text]`, socialLink.text);
            formDataToSend.append(`socialLinks[${index}][link]`, socialLink.link);
        });
    
        if (formData.clientImage) {
            formDataToSend.append("clientImage", formData.clientImage);
        }for (const [key, value] of formDataToSend.entries()) {
            console.log(`${key}: ${value}`);
        }
        
        try {
            const response = selectedTestimonial ? await fetch(`${endPoint}/clientTestimonial/${selectedTestimonial._id}`, {
                method: "PUT",
                body: formDataToSend,
            }) : await fetch(`${endPoint}/clientTestimonial`, {
                method: "POST",
                body: formDataToSend,
            });

            Swal.fire({
                position: "top-end",
                icon: "success",
                title: `${selectedTestimonial ?"Testimonial updated successfully!" : "Testimonial added successfully!"}`,
                showConfirmButton: false,
                timer: 1500,
            });
    
            if (!response.ok) {
                throw new Error("Failed to submit form.");
            }
    
            const data = await response.json();
            toast.success("Client testimonial added successfully!");
            setFormData({
                testimonialText: '',
                clientName: '',
                clientDescription: '',
                rating: 5,
                socialLinks: [{ text: '', link: '' }],
                websiteOrVideoLink: '',
                clientImage: null,
            });
            setClientImagePreview(null);
            setClientImageUpdate(null);
        } catch (error) {
            console.error(error.message);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };
    

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        console.log(file)
        setFormData({ ...formData, clientImage: file });
        const previewUrl = URL.createObjectURL(file);
        setClientImagePreview(previewUrl);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSocialLinkChange = (index, field, value) => {
        const updatedSocialLinks = [...formData.socialLinks];
        updatedSocialLinks[index][field] = value;
        setFormData({ ...formData, socialLinks: updatedSocialLinks });
    };
    
    const addSocialLink = () => {
        setFormData({
            ...formData,
            socialLinks: [...formData.socialLinks, { text: '', link: '' }]
        });
    };
    
    const removeSocialLink = (index) => {
        const newSocialLinks = formData.socialLinks.filter((_, i) => i !== index);
        setFormData({ ...formData, socialLinks: newSocialLinks });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-bars loading-lg"></span>
            </div>
        );
    }

    return (
        <div>
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
                            Add Testimonial
                        </span>
                    </li>
                </ul>
                <ToastContainer />
            </div>
            <Link to="/testimonials">
      <button className="btn btn-sm flex justify-center items-center mx-auto bg-black text-white mb-5">Manage Testimonials</button></Link>
     
            <form onSubmit={handleSubmit} className="lg:w-1/2 md:w-[80%] w-[96%] mx-auto bg-white p-6 mb-10 rounded-2xl shadow-md">
                <h4 className="text-xl font-semibold text-center mb-4">
                    {selectedTestimonial ? "Update Testimonial" : "Add Testimonial"}
                </h4>
                <div className="flex flex-col mb-4 mt-5">
                    <label className="mb-2">Testimonial Text</label>
                    <textarea
                        name="testimonialText"
                        value={formData.testimonialText}
                        onChange={handleInputChange}
                        className="textarea textarea-bordered"
                        placeholder="Testimonial Text"
                        rows={5}
                    />
                </div>
                <div className="flex flex-col mb-4">
                    <label className="mb-2">Client Name</label>
                    <input
                        type="text"
                        name="clientName"
                        value={formData.clientName}
                        onChange={handleInputChange}
                        className="input input-bordered"
                        placeholder="Client Name"
                    />
                </div>
                <div className="flex flex-col mb-4">
                    <label className="mb-2">Client Description</label>
                    <input
                        type="text"
                        name="clientDescription"
                        value={formData.clientDescription}
                        onChange={handleInputChange}
                        className="input input-bordered"
                        placeholder="Client Description"
                    />
                </div>
                <div className="flex flex-col mb-4">
                    <label className="mb-2">Rating</label>
                    <input
                        type="text"
                        name="rating"
                        value={formData.rating}
                        onChange={handleInputChange}
                        className="input input-bordered"
                        placeholder="Rating"
                    />
                </div>
                <div className="flex flex-col mb-4">
                    <label className="mb-2">Website or Video Link</label>
                    <input
                        type="text"
                        name="websiteOrVideoLink"
                        value={formData.websiteOrVideoLink}
                        onChange={handleInputChange}
                        className="input input-bordered"
                        placeholder="Website or Video Link"
                    />
                </div>
                <div className="flex flex-col mb-4">
                    <label className="mb-2">Social Links</label>
                    {formData.socialLinks.map((link, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                            <input
                                type="text"
                                placeholder="Text"
                                value={link.text}
                                onChange={(e) => handleSocialLinkChange(index, "text", e.target.value)}
                                className="input input-bordered w-full"
                            />
                            <input
                                type="text"
                                placeholder="Link"
                                value={link.link}
                                onChange={(e) => handleSocialLinkChange(index, "link", e.target.value)}
                                className="input input-bordered w-full"
                            />
                            <button
                                type="button"
                                onClick={() => removeSocialLink(index)}
                                className="btn bg-red-600 text-white"
                            >
                                <FaTrashAlt />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addSocialLink}
                        className="text-black text-4xl mt-2"
                    >
                        +
                    </button>
                </div>
                <div className="flex flex-col mb-4">
                    <label className="mb-2">Client Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="file-input input-bordered"
                    />
                    {clientImagePreview ? (
                        <img
                            src={clientImagePreview}
                            alt="Client Image Preview"
                            className="mt-4 h-32 w-32 rounded-xl border object-cover"
                        />
                    ):
                        <img
                            src={clientImageUpdate}
                            alt="Client Image UclientImageUpdate"
                            className="mt-4 h-32 w-32 rounded-xl border object-cover"
                        />
                    }
                </div>


                <button type="submit" className="btn bg-black text-white btn-sm w-full">
                    {selectedTestimonial ? "Update Testimonial" : "Add Testimonial"}
                </button>
            </form>
        </div>
    );
};

export default AddTestimonial;
