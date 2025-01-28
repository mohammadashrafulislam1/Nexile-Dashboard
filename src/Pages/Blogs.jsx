import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsPencilSquare } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";
import { endPoint } from "../Components/ForAll/ForAll";
import Swal from "sweetalert2";

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchBlog();
    }, []);

    const fetchBlog = async () => {
        setLoading(true)
        const response = await axios.get(`${endPoint}/blog`);
        // Parse tags for each blog
         const sortedProperties = response.data
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    .slice(0, 8);
        const blogsWithParsedTags = sortedProperties.map(blog => ({
            ...blog,
            tags: JSON.parse(blog.tags) // Parse tags string into an array
        }));
        setBlogs(blogsWithParsedTags);
        setLoading(false)
    };
    const handleEditBlog = (blog) => {
        // Handle edit work functionality
    navigate("/addblog", { state: { blog } });
    };

    // Filter blogs based on search term
    const filteredBlogs = blogs.filter((blog) =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const handleDeleteBlog = async (blog) => {
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
                await axios.delete(`${endPoint}/blog/${blog._id}`);
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: `Blog ${blog?.title} deleted successfully!`,
                    showConfirmButton: false,
                    timer: 1500,
                });
                fetchBlog(); // Refresh the blogs list
            } catch (error) {
                console.error("Error deleting blog:", error);
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong while deleting the blog!",
                });
            }
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
        <div className="p-4 overflow-hidden">
            <h1 className="md:text-3xl text-xl font-semibold mb-4 text-center">Manage Blogs</h1>
            <Link to="/addblog">
                <button className="btn btn-sm mb-2 flex justify-center items-center mx-auto bg-black text-white">
                    Add Blog
                </button>
            </Link>

            {/* Search Input */}
            <div className="flex justify-center items-center">
                <input
                    type="text"
                    placeholder="Search blogs..."
                    className="mb-4 p-2 lg:w-1/3 md:w-1/2 w-3/4 border border-gray-300 rounded shadow"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="overflow-x-auto mr-3 !rounded-[15px]">
                <table className="min-w-full bg-white border-gray-200 !rounded-[15px]">
                    <thead>
                        <tr className="bg-black text-white">
                            <th className="py-3 px-6 text-left text-xs font-semibold uppercase tracking-wider">Image</th>
                            <th className="py-3 px-6 text-left text-xs font-semibold uppercase tracking-wider">Title</th>
                            <th className="py-3 px-6 text-left text-xs font-semibold uppercase tracking-wider">Category</th>
                            <th className="py-3 px-6 text-left text-xs font-semibold uppercase tracking-wider">Tags</th>
                            <th className="py-3 px-6 text-left text-xs font-semibold uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="!rounded-xl">
                        {filteredBlogs.map((blog) => (
                            <tr key={blog._id} className="border-t border-gray-200 hover:bg-gray-900 hover:text-white">
                                <td className="py-3 px-6">
                                    <img
                                        className="w-20 h-20 object-cover rounded"
                                        src={blog.image}
                                        alt={blog.title || "Blog Image"}
                                    />
                                </td>
                                <td className="py-3 px-2 text-xl font-medium">{blog.title}</td>
                                <td className="py-3 px-2 text-sm">{blog.category}</td>
                                <td className="py-3 px-2">
                                    <div className="flex flex-wrap gap-1">
                                        {blog.tags.map((tag, index) => (
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
                                            aria-label="Edit blog"
                                            className="text-blue-600 hover:text-blue-800 text-lg p-2 rounded-full bg-white border border-gray-200"
                                            onClick={() => handleEditBlog(blog)}
                                        >
                                            <BsPencilSquare />
                                        </button>
                                        <button
                                            aria-label="Delete blog"
                                            type="button"
                                            className="text-red-600 hover:text-red-800 text-lg p-2 rounded-full bg-white border border-gray-200"
                                            onClick={() => handleDeleteBlog(blog)}
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

export default Blogs;
