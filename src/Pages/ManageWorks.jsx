import axios from "axios";
import { useEffect, useState } from "react";
import { endPoint } from "../Components/ForAll/ForAll";
import { BsPencilSquare } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const ManageWorks = () => {
    const [works, setWorks] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        fetchWorks();
    }, []);
    const fetchWorks = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${endPoint}/works`);
            console.log(response.data.works); // Log the response data
            setWorks(response.data.works); // Update the state with fetched works
            setLoading(false)
        } catch (error) {
            console.error("Error fetching works:", error); // Handle error
        }
    };

    const handleEditWork = (work) => {
        // Handle edit work functionality
        console.log("Editing work:", work);
    navigate("/work", { state: { work } });
    };

    const handleDeleteWork = async (work) => {
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
                await axios.delete(`${endPoint}/works/${work._id}`);
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Work deleted successfully!",
                    showConfirmButton: false,
                    timer: 1500,
                });
                fetchWorks(); // Refresh the works list
            } catch (error) {
                console.error("Error deleting work:", error);
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong while deleting the work!",
                });
            }
        }
    };

    // Filter works based on the search term
    const filteredWorks = works.filter((work) =>
        work?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (loading) {
        return (
          <div className="flex justify-center items-center h-screen">
            <span className="loading loading-bars loading-lg"></span>
          </div>
        );
      }
    return (
        <div className="p-4 overflow-hidden">
            <h1 className="md:text-3xl text-xl font-semibold mb-4 text-center">Manage Works</h1>
            <Link to="/work"><button className="btn btn-sm mb-2 flex justify-center items-center mx-auto bg-black text-white">Add Work</button></Link>
            {/* Search Input */}
            <div className="flex justify-center items-center"><input
                type="text"
                placeholder="Search works..."
                className="mb-4 p-2 lg:w-1/3 md:w-1/2 w-3/4 border border-gray-300 rounded shadow"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            /></div>

<div className="overflow-x-auto mr-3 !rounded-[15px]">
    <table className="min-w-full bg-white  border-gray-200 !rounded-[15px]">
        <thead>
            <tr className="bg-black text-white">
                <th className="py-3 px-6 text-left text-xs font-semibold uppercase tracking-wider">Image</th>
                <th className="py-3 px-6 text-left text-xs font-semibold uppercase tracking-wider">Title</th>
                <th className="py-3 px-6 text-left text-xs font-semibold uppercase tracking-wider">Category</th>
                <th className="py-3 px-6 text-left text-xs font-semibold uppercase tracking-wider">Client</th>
                <th className="py-3 px-6 text-left text-xs font-semibold uppercase tracking-wider">Completion Date</th>
                <th className="py-3 px-6 text-left text-xs font-semibold uppercase tracking-wider">Tags</th>
                <th className="py-3 px-6 text-left text-xs font-semibold uppercase tracking-wider">Actions</th>
            </tr>
        </thead>
        <tbody className="!rounded-xl">
            {filteredWorks?.map((work) => (
                <tr key={work._id} className="border-t border-gray-200 hover:bg-gray-900 hover:text-white">
                    <td className="py-3 px-6">
                        <img
                            className="w-20 h-20 object-cover rounded"
                            src={work.images[0]?.url}
                            alt={work.title || "Project Image"}
                        />
                    </td>
                    <td className="py-3 px-2 text-xl font-medium">{work.title}</td>
                    <td className="py-3 px-2 text-sm ">{work.category}</td>
                    <td className="py-3 px-2 text-sm ">{work.client}</td>
                    <td className="py-3 px-2 text-sm ">{new Date(work.completionDate).toLocaleDateString()}</td>
                    <td className="py-3 px-2">
                        <div className="flex flex-wrap gap-1">
                            {work.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="bg-gray-300 rounded-full px-2 py-0.5 text-xs text-gray-800"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </td>
                    <td className="py-3 px-6 text-center">
                        <div className="flex gap-2 justify-center">
                            <button
                                aria-label="Edit work"
                                className="text-blue-600 hover:text-blue-800 text-lg p-2 rounded-full bg-white border border-gray-200"
                                onClick={() => handleEditWork(work)}
                            >
                                <BsPencilSquare />
                            </button>
                            <button
                                aria-label="Delete work"
                                type="button"
                                className="text-red-600 hover:text-red-800 text-lg p-2 rounded-full bg-white border border-gray-200"
                                onClick={() => handleDeleteWork(work)}
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

export default ManageWorks;
