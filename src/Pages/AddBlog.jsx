import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { endPoint } from '../Components/ForAll/ForAll';
import { TagsInput } from 'react-tag-input-component';
import Swal from 'sweetalert2';
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';  // Import Quill's snow theme

const AddBlog = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const blogToEdit = location.state?.blog || null;

    console.log(blogToEdit)
    const [title, setTitle] = useState(blogToEdit?.title || '');
    const [category, setCategory] = useState(blogToEdit?.category || '');
    const [blogCategories, setBlogCategories] = useState([]);
    const [description, setDescription] = useState(blogToEdit?.description || '');
    const [metaTitle, setMetaTitle] = useState(blogToEdit?.metaTitle || '');
    const [metaDescription, setMetaDescription] = useState(blogToEdit?.metaDescription || '');
    const [tags, setTags] = useState(blogToEdit?.tags || []);
    const [image, setImage] = useState(blogToEdit?.image || null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false); // Loading state

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const responseCategory = await axios.get(`${endPoint}/blogCategory`);
                setBlogCategories(responseCategory?.data?.BlogCategories);
            } catch (error) {
                console.error('Error fetching categories', error);
                toast.error('Failed to load categories.');
            }
        };
        fetchCategories();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file)
        if (file) {
            setImagePreview(URL.createObjectURL(file)); // Create a URL for the selected image
        } else {
            setImagePreview(null); // Clear the preview if no file is selected
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading to true

        const formData = new FormData();
        formData.append('title', title);
        formData.append('category', category);
        formData.append('description', description);
        formData.append('metaTitle', metaTitle);
        formData.append('metaDescription', metaDescription);
        formData.append('tags', JSON.stringify(tags));
        if (image) formData.append('image', image);

        try {
            if (blogToEdit) {
                await axios.put(`${endPoint}/blog/${blogToEdit._id}`, formData);
                toast.success('Blog post updated successfully!');
            } else {
                await axios.post(`${endPoint}/blog`, formData);
                toast.success('Blog post created successfully!');
            }
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: `${blogToEdit ? "Blog updated successfully!" : "Blog added successfully!"}`,
                showConfirmButton: false,
                timer: 1500,
            });
            navigate('/blogs');
        } catch (error) {
            console.error('Error submitting form', error);
            toast.error('Failed to submit the form. Please try again.');
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    // Loading indicator
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-bars loading-lg"></span>
            </div>
        );
    }

    console.log(imagePreview)

    return (
        <div className="container mx-auto p-6">
            <div className="breadcrumbs text-sm lg:w-1/2 md:w-[80%] w-[96%] mx-auto">
                <ul className="my-6">
                    <li>
                        <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:underline">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-4 w-4 stroke-current">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
                            </svg>
                            Home
                        </Link>
                    </li>
                    <li>
                        <span className="inline-flex items-center gap-2 text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-4 w-4 stroke-current">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            Services
                        </span>
                    </li>
                </ul>
                <ToastContainer />
            </div>

            <Link to="/blogs">
                <button className="btn btn-sm mb-2 flex justify-center items-center mx-auto bg-black text-white">Blogs</button>
            </Link>
            <form
                onSubmit={handleSubmit}
                className="lg:w-[70%] md:w-[80%] w-[96%] mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 space-y-4"
            >
                <h2 className="text-2xl font-bold text-center mb-6">
                    {blogToEdit ? 'Edit Blog Post' : 'Add New Blog Post'}
                </h2>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Title</span>
                    </label>
                    <input
                        type="text"
                        className="input input-bordered w-full"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Category</span>
                    </label>
                    <select
                        className="select select-bordered w-full my-3"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        <option disabled value="">Select Category</option>
                        {blogCategories.map((category) => (
                            <option key={category._id} value={category.name}>{category.name}</option>
                        ))}
                    </select>
                </div>

                <div className="form-control  mb-[300px]" 
                        style={{ height: "300px" }}>
                    <label className="label">
                        <span className="label-text">Description</span>
                    </label>
                    <ReactQuill
  className="react-quill-editor rounded-[10px] mb-32"
  value={description}
  onChange={(value) => setDescription(value)}  // Use the updated value directly
  required
  theme="snow" // Default theme with a toolbar
  style={{ height: "230px" }} // Set the height here
  modules={{
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"], // Text formatting
      [{ list: "ordered" }, { list: "bullet" }], // Lists
      ["link", "image", "video"], // Media
      ["clean"], // Remove formatting
    ],
  }}
/>


                </div>

                <div className="form-control mt-24">
                    <label className="label">
                        <span className="label-text">Meta Title</span>
                    </label>
                    <input
                        type="text"
                        className="input input-bordered w-full"
                        value={metaTitle}
                        onChange={(e) => setMetaTitle(e.target.value)}
                    />
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Meta Description</span>
                    </label>
                    <textarea
                        className="textarea textarea-bordered w-full"
                        value={metaDescription}
                        onChange={(e) => setMetaDescription(e.target.value)}
                    />
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Tags</span>
                    </label>
                    <TagsInput
                        value={tags}
                        onChange={setTags}
                        name="tags"
                        placeHolder="Add tags..."
                    />
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Upload Image</span>
                    </label>
                    <input
                        type="file"
                        className="file-input file-input-bordered w-full"
                        onChange={handleImageChange}
                    />
                    {imagePreview ? (
                        <img
                            src={imagePreview} // Use the object URL for the selected image
                            alt={title}
                            className="mt-2 w-32 w-32 rounded-xl my-3"
                        />
                    ) :
                        image && <img
                        src={image} // Use the object URL for the selected image
                        alt={title}
                        className="mt-2 w-32 w-32 rounded-xl my-3"
                    />
                    }
                </div>

                <button type="submit" className="btn btn-primary w-full">
                    {blogToEdit ? 'Update Blog' : 'Add Blog'}
                </button>
            </form>
        </div>
    );
};

export default AddBlog;
