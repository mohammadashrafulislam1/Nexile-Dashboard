import { FaTrashAlt } from "react-icons/fa";
import { BsPencilSquare } from "react-icons/bs";
import { useEffect, useState } from "react";
import axios from "axios";
import { endPoint } from "../Components/ForAll/ForAll";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Testimonials = () => {
    const [testimonials, setTestimonials] = useState();
    const navigate = useNavigate()
    useEffect(()=>{
        fetchTestimonail()
    }, [endPoint])
    const fetchTestimonail = async()=>{
        try{
            const response = await axios.get(`${endPoint}/clientTestimonial`);
    setTestimonials(response?.data?.testimonials)
    console.log(response)

        }
        catch{
            
        }
    }
    const handleEditTestimonial = (testimonial) => {
        // Handle edit work functionality;
    navigate("/addTestimonial", { state: { testimonial } });
    };

    const handleDeleteTestimonial = async (testimonial) => {
        if (!testimonial?._id) {
            Swal.fire({
                icon: "error",
                title: "Invalid Testimonial",
                text: "Testimonial data is incomplete or missing.",
            });
            return;
        }
    
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
                await axios.delete(`${endPoint}/clientTestimonial/${testimonial._id}`);
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Testimonial deleted successfully!",
                    showConfirmButton: false,
                    timer: 1500,
                });
                fetchTestimonail(); // Refresh the testimonials list
            } catch (error) {
                console.error("Error deleting testimonial:", error.response?.data || error.message);
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong while deleting the testimonial!",
                });
            }
        }
    };
    

    return (
    <div className=" my-10 w-[90%] mx-auto">
         <Link to="/addTestimonial">
      <button className="btn btn-sm flex justify-center items-center mx-auto bg-black text-white mb-5">Add Testimonial</button></Link>
     
        <div className="overflow-x-auto mr-3 !rounded-[15px]">
            <table className="min-w-full bg-white border-gray-200 !rounded-[15px]">
                <thead>
                    <tr className="bg-black text-white">
                        <th className="py-3 px-6 text-left text-xs font-semibold uppercase tracking-wider">Image</th>
                        <th className="py-3 px-6 text-left text-xs font-semibold uppercase tracking-wider">Client Name</th>
                        <th className="py-3 px-6 text-left text-xs font-semibold uppercase tracking-wider">Description</th>
                        <th className="py-3 px-6 text-left text-xs font-semibold uppercase tracking-wider">Rating</th>
                        <th className="py-3 px-6 text-left text-xs font-semibold uppercase tracking-wider">Social Links</th>
                        <th className="py-3 px-6 text-left text-xs font-semibold uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="!rounded-xl">
                    {testimonials?.map((testimonial) => (
                        <tr key={testimonial._id} className="border-t border-gray-200 hover:bg-gray-900 hover:text-white">
                            <td className="py-3 px-6">
                                <img
                                    className="w-20 h-20 object-cover rounded"
                                    src={testimonial.clientImage}
                                    alt={testimonial.clientName}
                                />
                            </td>
                            <td className="py-3 px-6 text-xl font-medium">{testimonial.clientName}</td>
                            <td className="py-3 px-6 text-sm">{testimonial.clientDescription}</td>
                            <td className="py-3 px-6 text-sm">{testimonial.rating} / 5</td>
                            <td className="py-3 px-6 text-sm">
                                <div className="flex flex-wrap gap-1">
                                    {testimonial.socialLinks.map((link) => (
                                        <a
                                            key={link._id}
                                            href={`http://${link.link}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-gray-300 rounded-full px-2 py-0.5 text-xs text-gray-800"
                                        >
                                            {link.text}
                                        </a>
                                    ))}
                                </div>
                            </td>
                            <td className="py-3 px-6 text-center">
                                <div className="flex gap-2 justify-center">
                                    <button
                                        aria-label="Edit testimonial"
                                        className="text-blue-600 hover:text-blue-800 text-lg p-2 rounded-full bg-white border border-gray-200"
                                        onClick={() => handleEditTestimonial(testimonial)}
                                    >
                                        <BsPencilSquare />
                                    </button>
                                    <button
                                        aria-label="Delete testimonial"
                                        type="button"
                                        className="text-red-600 hover:text-red-800 text-lg p-2 rounded-full bg-white border border-gray-200"
                                        onClick={() => handleDeleteTestimonial(testimonial)}
                                    >
                                        <FaTrashAlt />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
    );
};

export default Testimonials;
